import { Locator, Page } from '@playwright/test';
import BaseElements from './BaseElements';

export default class LatamElements extends BaseElements {
  constructor(readonly page: Page) {
    super(page);
    this.page = page;
  }

  getBotaoAceitarCookies(): Locator {
    return this.page.getByTestId('cookies-politics-button--button');
  }

  getCampoOrigem(): Locator {
    return this.page.getByTestId('fsb-origin--text-field');
  }

  getCampoDestino(): Locator {
    return this.page.getByTestId('fsb-destination--text-field');
  }

  getOpcaoOrigemSugerida(): Locator {
    return this.page.getByText('Florianópolis, FLN - Brasil');
  }

  getOpcaoDestinoSugerida(): Locator {
    return this.page.getByText('Tóquio, TYO - Japão');
  }

  getIconeCalendario(): Locator {
    return this.page.locator('#fsb-departure--text-field__end-icon > svg');
  }

  getBotaoProximoMesCalendario(): Locator {
    return this.page.getByTestId('fsb-calendar-desktop--btn-next-month');
  }

  getDataEspecifica(dataIso: string): Locator {
    return this.page.getByTestId(`date-${dataIso}`);
  }

  getBotaoBuscarVoos(): Locator {
    return this.page.getByTestId('fsb-search-flights--button');
  }
}
