import { Page, expect } from '@playwright/test';
import LatamElements from '../elements/LatamElements';
import BasePage from './BasePage';

export default class LatamPage extends BasePage {
  readonly latamElements: LatamElements;

  constructor(readonly page: Page) {
    super(page);
    this.page = page;
    this.latamElements = new LatamElements(page);
  }

  async aceitarCookies(): Promise<void> {
    try {
      const botaoCookies = this.latamElements.getBotaoAceitarCookies();
      if (await botaoCookies.isVisible({ timeout: 5000 })) {
        await botaoCookies.click();
      }
    } catch (error) {
      // Ignora se já estiver aceito
    }
  }

  async preencherBuscaCompleta(
    dataIda: string,
    dataVolta: string
  ): Promise<Page> {
    // 1. Origem
    await this.latamElements.getCampoOrigem().click();
    await this.latamElements.getCampoOrigem().fill('Flori');
    await this.latamElements.getOpcaoOrigemSugerida().click();

    // 2. Destino
    await this.latamElements.getCampoDestino().click();
    await this.latamElements.getCampoDestino().fill('Tóqui');
    await this.latamElements.getOpcaoDestinoSugerida().click();

    // 3. Abrir o calendário de datas
    await this.latamElements.getIconeCalendario().click();

    // 4. Selecionar Datas (Avança os meses e escolhe ida e volta)
    await this.latamElements.getBotaoProximoMesCalendario().click();
    await this.latamElements.getBotaoProximoMesCalendario().click();

    await this.latamElements.getDataEspecifica(dataIda).click();
    await this.latamElements.getDataEspecifica(dataVolta).click();

    // 5. Disparar a busca e capturar a nova aba (popup) de resultados
    const [newPage] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.latamElements.getBotaoBuscarVoos().click()
    ]);

    await newPage.waitForLoadState('domcontentloaded');
    return newPage;
  }
}
