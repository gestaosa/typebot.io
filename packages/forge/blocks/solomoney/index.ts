import { OpenAILightLogo, OpenAIDarkLogo } from './logo'
import { createChatCompletion } from './actions/createChatCompletion'
import { createSpeech } from './actions/createSpeech'
import { createBlock } from '@typebot.io/forge'
import { auth } from './auth'
import { baseOptions } from './baseOptions'
import { askAssistant } from './actions/askAssistant'

export const solomoney = createBlock({
  id: 'solomoney' as const,
  name: 'Solomoney',
  tags: ['openai'],
  LightLogo: OpenAILightLogo,
  DarkLogo: OpenAIDarkLogo,
  auth,
  options: baseOptions,
  actions: [createChatCompletion, askAssistant, createSpeech],
})
