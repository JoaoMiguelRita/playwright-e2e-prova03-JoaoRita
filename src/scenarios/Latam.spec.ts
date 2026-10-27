import { test, expect } from '@playwright/test';
import { join } from 'path';
import { TheConfig } from 'sicolo';
import LatamPage from '../support/pages/LatamPage';
import HotelPage from '../support/pages/HotelPage';
import SeguroViagemPage from '../support/pages/SeguroViagemPage';

test.describe('Validar compra de passagem aérea de Florianópolis para Tóquio', () => {
  const CONFIG = join(__dirname, '../support/fixtures/config.yml');
  let latamPage: LatamPage;
  const BASE_URL = TheConfig.fromFile(CONFIG)
    .andPath('application.latam')
    .retrieveData();

  test.beforeEach(async ({ page }) => {
    latamPage = new LatamPage(page);
    await page.goto(BASE_URL);
    await latamPage.aceitarCookies();
  });

  test('Realizar busca de voos de Florianópolis para Tóquio', async () => {
    // Passa as datas no formato YYYY-MM-DD correspondentes aos data-testid capturados
    const resultadosPage = await latamPage.preencherBuscaCompleta(
      '2026-12-01',
      '2026-12-07'
    );

    // Valida se a nova página abriu os resultados ou tratou o cenário
    expect(resultadosPage.url()).toContain('latamairlines.com');
  });
});

test.describe('Validar busca de hospedagem no site da LATAM', () => {
  const CONFIG = join(__dirname, '../support/fixtures/config.yml');
  let hotelPage: HotelPage;
  const BASE_URL = TheConfig.fromFile(CONFIG)
    .andPath('application.latam')
    .retrieveData();

  test.beforeEach(async ({ page }) => {
    hotelPage = new HotelPage(page);
    await page.goto(BASE_URL);
    await hotelPage.aceitarCookies();
  });

  test('Buscar hospedagem em Acapulco com datas válidas', async () => {
    // Rótulos de data capturados no seu debug
    const dataEntrada = 'Escolha Terça-feira, 24 de';
    const dataSaida = 'Escolha Segunda-feira, 30 de';

    const paginaHoteis = await hotelPage.buscarHospedagem(
      'Acapu',
      dataEntrada,
      dataSaida
    );

    // Valida que a nova aba abriu e redirecionou para o sistema de busca de hotéis
    await expect(paginaHoteis).toHaveURL(/hotel|hospedagem|booking/i);
  });
});

test.describe('Cotação de Seguro de Viagem LATAM', () => {
  const CONFIG = join(__dirname, '../support/fixtures/config.yml');
  let seguroPage: SeguroViagemPage;
  const BASE_URL = TheConfig.fromFile(CONFIG)
    .andPath('application.latam')
    .retrieveData();

  test.beforeEach(async ({ page }) => {
    seguroPage = new SeguroViagemPage(page);
    await page.goto(BASE_URL);
    await seguroPage.aceitarCookies();
  });

  test('Realizar cotação completa de seguro para Europa', async ({ page }) => {
    // Navega direto para a página onde o banner do seguro de viagem está consolidado
    await page.goto(
      'https://www.latamairlines.com/br/pt/experiencia/prepare-sua-viagem/restricoes'
    );
    await seguroPage.aceitarCookies();

    // Abre a cotação em nova aba a partir da página correta
    const pageAssistCard = await seguroPage.abrirCotacaoSeguro();

    const idDataInicio = '1793588400000';
    const idDataFim = '1794538800000';
    const idade = '24';

    await seguroPage.preencherECotarSeguro(
      pageAssistCard,
      idDataInicio,
      idDataFim,
      idade
    );
    await seguroPage.selecionarPlanoEContinuar(pageAssistCard);

    await expect(pageAssistCard).not.toHaveURL(BASE_URL);
  });
});
