import { test } from '@playwright/test';
import { join } from 'path';
import { TheConfig } from 'sicolo';
import LatamPage from '../support/pages/LatamPage';

test.describe('Validar compra de passagem aérea de múltiplas escalas', () => {
  const CONFIG = join(__dirname, '../support/fixtures/config.yml');
  let latamPage: LatamPage;
  const BASE_URL = TheConfig.fromFile(CONFIG)
    .andPath('application.bugereats_QA')
    .retrieveData();

  test.beforeEach(async ({ page }) => {
    latamPage = new LatamPage(page);
    await page.goto(BASE_URL);
  });

  test('Preencher formulário de viagem com dados válido', async () => {
    await latamPage.preencherFormulario();
    await latamPage.validarPreenchimento();
  });

  test('Preencher formulário de viagem com dados inválidos', async () => {
    await latamPage.preencherFormularioInvalido();
    await latamPage.validarPreenchimento();
  });

  test('Encontrar viagem de ida e volta', async () => {
    await latamPage.validarExistenciaViagensDeIda();
    await latamPage.selecionarViagemIda();
    await latamPage.validarExistenciaViagensDeVolta();
    await latamPage.selecionarViagemVolta();
    await latamPage.alterarViagemVolta();
    await latamPage.validarSelecoesParaAssentos();
  });

  test('Escolher assentos', async () => {
    await latamPage.preenchimentoAssentos();
    await latamPage.validarPreenchimentosAssentosParaContinuar();
  });  
  
  test('Definir bagagem e serviços', async () => {
    await latamPage.validarBagagem();
    await latamPage.irParaServicoesSeguinte();
    await latamPage.validarServicos();
    await latamPage.validarBagagensServicoesParaIrProximoPasso();
  }); 

  test('Validar detalhes da viagem', async () => {
    await latamPage.validarVooIda();
    await latamPage.validarPrecoFinal();
  });
});
