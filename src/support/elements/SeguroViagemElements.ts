import { Locator, Page } from '@playwright/test';
import BaseElements from './BaseElements';

export default class SeguroViagemElements extends BaseElements {
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

  getBotaoOpcaoSeguroViagem(): Locator {
    return this.page.getByTestId('id_1793142599558--button').first();
  }

  getLinkCotarSeguroPromo(): Locator {
    return this.page.getByTestId('promo-link--link');
  }

  getSelectDestino(pageParceiro: Page): Locator {
    return pageParceiro.getByRole('combobox', { name: 'Europa' });
  }

  getContainerCalendario(pageParceiro: Page): Locator {
    return pageParceiro.locator('#datepickerContainer__desktop');
  }

  getDataNoCalendario(pageParceiro: Page, idData: string): Locator {
    return pageParceiro.locator(`[id="${idData}"]`);
  }

  getBotaoAplicarDatas(pageParceiro: Page): Locator {
    return pageParceiro.getByRole('button', { name: 'Aplicar' });
  }

  getBotaoPassageiros(pageParceiro: Page): Locator {
    return pageParceiro.locator('.btn-passenger');
  }

  getCampoIdadePassageiro(pageParceiro: Page): Locator {
    return pageParceiro.locator('#passengerAge-1');
  }

  getBotaoCotarAgora(pageParceiro: Page): Locator {
    return pageParceiro.getByRole('button', { name: 'Cotar agora' });
  }

  getBotaoSelecionarPlano(pageParceiro: Page): Locator {
    return pageParceiro
      .locator('#scroll-item-container-L20-, #scroll-item-container-L30-')
      .getByRole('link', { name: 'Selecionar' })
      .first();
  }

  getBotaoContinuarPlano(pageParceiro: Page): Locator {
    return pageParceiro.getByRole('button', { name: 'Continuar' });
  }
}
