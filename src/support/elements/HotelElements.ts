import { Locator, Page } from '@playwright/test';
import BaseElements from './BaseElements';

export default class HotelElements extends BaseElements {
  constructor(readonly page: Page) {
    super(page);
    this.page = page;
  }

  getBotaoFecharModalPais(): Locator {
    return this.page.getByTestId('country-suggestion--dialog__close-button')
      .or(this.page.locator('#country-suggestion button[aria-label="Close"]'))
      .or(this.page.locator('#country-suggestion--dialog__btn-confirm'));
  }

  getBotaoAceitarCookies(): Locator {
    return this.page.getByTestId('cookies-politics-button--button');
  }

  getAbaHospedagens(): Locator {
    return this.page.getByRole('tab', { name: /hospedagens/i });
  }

  getCampoDestinoHotel(): Locator {
    return this.page.getByTestId(
      'hotel-searchbox-destination-autocompleteinput'
    );
  }

  getOpcaoDestinoSugerido(): Locator {
    return this.page.getByTestId(
      'aca--autocomplete__listitem--menuitem__content'
    );
  }

  getCampoDataEntrada(): Locator {
    return this.page.getByTestId(
      'hotel-searchbox-datepicker-startdate-field--button-input'
    );
  }

  getDataEspecifica(rotuloData: string): Locator {
    return this.page.getByRole('button', { name: rotuloData });
  }

  getBotaoBuscarHoteis(): Locator {
    return this.page.getByTestId('hotel-searchbox-button--button');
  }
}
