import { Page, expect } from '@playwright/test';
import SeguroViagemElements from '../elements/SeguroViagemElements';
import BasePage from './BasePage';

export default class SeguroViagemPage extends BasePage {
  readonly seguroElements: SeguroViagemElements;

  constructor(readonly page: Page) {
    super(page);
    this.page = page;
    this.seguroElements = new SeguroViagemElements(page);
  }

  async aceitarCookiesEPopups(): Promise<void> {
    // 1. Trata os Cookies
    try {
      const botaoCookies = this.seguroElements.getBotaoAceitarCookies();
      if (await botaoCookies.isVisible({ timeout: 5000 })) {
        await botaoCookies.click();
      }
    } catch (e) {
      // Ignora se não aparecer
    }

    // 2. FECHA O POPUP DE SUGESTÃO DE PAÍS (Causa da falha no GitHub Actions)
    try {
      const modalPaisBtn = this.page.getByTestId('country-suggestion--dialog__close-button')
        .or(this.page.locator('#country-suggestion--dialog__btn-confirm'))
        .or(this.page.locator('[data-testid="country-suggestion--dialog"] button').first());

      if (await modalPaisBtn.isVisible({ timeout: 5000 })) {
        await modalPaisBtn.click({ force: true });
      }
    } catch (e) {
      // Ignora se o modal não for exibido
    }
  }

  async abrirCotacaoSeguro(): Promise<Page> {
    // Como a navegação vai direto para a página de restrições/seguro,
    // basta aguardar o link da promoção/cotar ficar visível e clicar.
    const linkPromo = this.seguroElements.getLinkCotarSeguroPromo();
    await linkPromo.waitFor({ state: 'visible', timeout: 20000 });

    const [page1] = await Promise.all([
      this.page.waitForEvent('popup'),
      linkPromo.click()
    ]);

    await page1.waitForLoadState('domcontentloaded');
    return page1;
  }

  async preencherECotarSeguro(
    page1: Page,
    idDataInicio: string,
    idDataFim: string,
    idade: string
  ): Promise<void> {
    // 1. Seleciona o Destino Europa
    await this.seguroElements.getSelectDestino(page1).click();

    // 2. Abre o Calendário e escolhe as datas
    await this.seguroElements.getContainerCalendario(page1).click();
    await this.seguroElements.getDataNoCalendario(page1, idDataInicio).click();
    await this.seguroElements.getDataNoCalendario(page1, idDataFim).click();
    await this.seguroElements.getBotaoAplicarDatas(page1).click();

    // 3. Passageiro - Tratamento completo de eventos para habilitar o botão
    const botaoPassageiro = this.seguroElements.getBotaoPassageiros(page1);
    await botaoPassageiro.click();

    const campoIdade = page1.locator('#passengerAge-1');
    await campoIdade.waitFor({ state: 'visible', timeout: 10000 });

    // Clica no campo para focar
    await campoIdade.click();

    // Digita pausadamente como um usuário real para acionar os listeners de change/input do formulário
    await campoIdade.pressSequentially(idade, { delay: 150 });

    // Dispara eventos manuais e tecla Tab para que a interface revalide o botão
    await campoIdade.dispatchEvent('input');
    await campoIdade.dispatchEvent('change');
    await campoIdade.press('Tab');

    // 4. Aguarda o botão 'Cotar agora' ficar habilitado e clica
    const botaoCotar = this.seguroElements.getBotaoCotarAgora(page1);
    await expect(botaoCotar).toBeEnabled({ timeout: 10000 });
    await botaoCotar.click();
  }

  async selecionarPlanoEContinuar(page1: Page): Promise<void> {
    // Aguarda o redirecionamento para a página de resultados dos planos da Assist Card
    await page1.waitForURL(/Products|contextid/i, { timeout: 60000 });

    // Clica no botão de selecionar o plano
    const botaoSelecionar = this.seguroElements.getBotaoSelecionarPlano(page1);
    await botaoSelecionar.waitFor({ state: 'visible', timeout: 30000 });
    await botaoSelecionar.click();

    // Clica em Continuar
    const botaoContinuar = this.seguroElements.getBotaoContinuarPlano(page1);
    await botaoContinuar.waitFor({ state: 'visible', timeout: 20000 });
    await botaoContinuar.click();
  }
}
