import { Page } from '@playwright/test';
import HotelElements from '../elements/HotelElements';
import BasePage from './BasePage';

export default class HotelPage extends BasePage {
  readonly hotelElements: HotelElements;

  constructor(readonly page: Page) {
    super(page);
    this.page = page;
    this.hotelElements = new HotelElements(page);
  }

  async aceitarCookiesEPopups(): Promise<void> {
    // 1. Trata os Cookies
    try {
      const botaoCookies = this.hotelElements.getBotaoAceitarCookies();
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

  async buscarHospedagem(
    destino: string,
    dataEntradaRotulo: string,
    dataSaidaRotulo: string
  ): Promise<Page> {
    await this.hotelElements.getAbaHospedagens().click();

    await this.hotelElements.getCampoDestinoHotel().click();
    await this.hotelElements.getCampoDestinoHotel().fill(destino);
    await this.hotelElements.getOpcaoDestinoSugerido().click();

    await this.hotelElements.getCampoDataEntrada().click();
    await this.hotelElements.getDataEspecifica(dataEntradaRotulo).click();
    await this.hotelElements.getDataEspecifica(dataSaidaRotulo).click();

    const [newPage] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.hotelElements.getBotaoBuscarHoteis().click()
    ]);

    await newPage.waitForLoadState('domcontentloaded');
    return newPage;
  }
}
