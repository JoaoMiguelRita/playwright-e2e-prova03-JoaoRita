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

  async aceitarCookies(): Promise<void> {
    try {
      const botaoCookies = this.hotelElements.getBotaoAceitarCookies();
      if (await botaoCookies.isVisible({ timeout: 5000 })) {
        await botaoCookies.click();
      }
    } catch (error) {
      // Ignora se não aparecer
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
