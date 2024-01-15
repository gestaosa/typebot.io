import { ChatCompletionTool } from 'openai/resources'

export const tools: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'calcula_parcela',
      description: 'calcula o valor da parcela a a partir do valor do imóvel',
      parameters: {
        type: 'object',
        properties: {
          imovel: {
            type: 'number',
            description: 'Valor do imóvel',
          },
          parcelas: {
            type: 'number',
            description: 'Número de parcelas',
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
      description: 'calcula o valor do imóvel a partir do valor da parcela',
      parameters: {
        type: 'object',
        properties: {
          parcela: {
            type: 'number',
            description: 'Valor da parcela',
          },
          parcelas: {
            type: 'number',
            description: 'Número de parcelas',
          },
        },
        required: ['parcela'],
      },
    },
  },

  {
    type: 'function',
    function: {
      name: 'calcula_parcelas',
      description:
        'calcula a quantidade de parcelas a partir do valor do imóvel e o valor da parcela',
      parameters: {
        type: 'object',
        properties: {
          imovel: {
            type: 'number',
            description: 'Valor do imovel',
          },
          parcela: {
            type: 'number',
            description: 'Valor da parcelas',
          },
        },
        required: ['imovel', 'parcela'],
      },
    },
  },
]

const aviso =
  'Valores para fins de simulação. Valores e taxas estão sujeitas à aprovação de crédito e demais condições do produto vigentes no momento da contratação. Calcularemos os valores finais assim que tivermos mais informações sobre o seu perfil.'

const nice = (value: number) => {
  return Math.ceil(value / 10) * 10
}

export const runTools: Record<string, (args: any) => any> = {
  calcula_parcela: ({ imovel, parcelas = 180 }) => {
    const parcela = nice((imovel * 1.2) / parcelas)
    return JSON.stringify({ imovel, parcela, parcelas, aviso })
  },
  calcula_imovel: ({ parcela, parcelas = 180 }) => {
    const imovel = nice((parcela * parcelas) / 1.2)
    return JSON.stringify({ imovel, parcela, parcelas, aviso })
  },
  calcula_parcelas: ({ imovel, parcela }) => {
    const parcelas = nice((imovel * 1.2) / parcela)
    return JSON.stringify({ imovel, parcela, parcelas, aviso })
  },
}
