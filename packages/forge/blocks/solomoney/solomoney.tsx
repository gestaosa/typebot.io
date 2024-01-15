import { ChatCompletionTool } from 'openai/resources'

export const tools: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'calcula_parcela',
      description: 'Use se o cliente não definir o valor da parcela.',
      parameters: {
        type: 'object',
        properties: {
          imovel: {
            type: 'number',
            description: 'Valor do imóvel',
          },
          prazo: {
            type: 'number',
            description: 'Número de parcelas (opcional)',
          },
        },
        required: ['imovel'],
      },
    },
  },

  {
    type: 'function',
    function: {
      name: 'calcula_imovel',
      description: 'Use se o cliente não definir o valor do imóvel.',
      parameters: {
        type: 'object',
        properties: {
          parcela: {
            type: 'number',
            description: 'Valor da parcela',
          },
          prazo: {
            type: 'number',
            description: 'Número de parcelas (opcional)',
          },
        },
        required: ['parcela'],
      },
    },
  },

  {
    type: 'function',
    function: {
      name: 'calcula_prazo',
      description: 'Use se o cliente estiver incerto sobre o prazo.',
      parameters: {
        type: 'object',
        properties: {
          imovel: {
            type: 'number',
            description: 'Valor do imovel',
          },
          parcela: {
            type: 'number',
            description: 'Valor da parcela',
          },
        },
        required: ['imovel', 'parcela'],
      },
    },
  },
]

const aviso =
  'Valores para fins de simulação. Valores e taxas estão sujeitas à aprovação de crédito e demais condições do produto vigentes no momento da contratação. Valores reais serão calculados assim que tivermos mais informações.\nPergunte ao cliente se ele está satisfeito com estes valores.'

function calcula_parcela(imovel: number, prazo = 180) {
  return nice((imovel * 1.2) / prazo)
}

function calcula_imovel(parcela: number, prazo = 180) {
  return nice((parcela * prazo) / 1.2)
}

function calcula_prazo(imovel: number, parcela: number) {
  return nice((imovel * 1.2) / parcela)
}

const nice = (value: number) => {
  return Math.ceil(value / 10) * 10
}

export const runTools: Record<string, (args: any) => any> = {
  calcula_parcela: ({ imovel, prazo = 180 }) => {
    return present({ imovel, parcela: calcula_parcela(imovel, prazo), prazo })
  },
  calcula_imovel: ({ parcela, prazo = 180 }) => {
    return present({ imovel: calcula_imovel(parcela, prazo), parcela, prazo })
  },
  calcula_prazo: ({ imovel, parcela }) => {
    return present({ imovel, parcela, prazo: nice((imovel * 1.2) / parcela) })
  },
}

function present(data: { imovel: number; parcela: number; prazo: number }) {
  if (data.prazo > 220) {
    const a = calcula_imovel(data.parcela, 220)
    const b = calcula_parcela(data.imovel, 220)
    return `Valores inválidos. Reduza o valor do imóvel para ${a} ou aumente o valor da parcela para ${b}`
  }

  if (data.prazo < 100) {
    const a = calcula_imovel(data.parcela, 100)
    const b = calcula_parcela(data.imovel, 100)
    return `Valores inválidos.Aumente o valor do imóvel para ${a} ou reduza o valor da parcela para ${b}`
  }

  return JSON.stringify({ ...data, aviso })
}
