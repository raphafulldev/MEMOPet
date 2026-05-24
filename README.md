# MemoPet

MemoPet e um app mobile offline-first em React Native com Expo para apoiar memorizacao afetiva, rotina e vinculo familiar de pessoas com Alzheimer leve ou moderado. O foco do MVP e oferecer uma experiencia acolhedora, simples e expandivel, sem prometer tratamento medico.

## Objetivo

O app apresenta um pet digital carinhoso, memorias com fotos de familiares, um jogo simples de reconhecimento, uma rotina com lembretes e um modo cuidador para cadastro local. Toda a experiencia foi desenhada com botoes grandes, fonte maior, poucas opcoes por tela e linguagem positiva.

## Stack

- Expo SDK 56
- React Native
- TypeScript
- Expo Router
- Zustand
- Expo SQLite
- Expo Notifications
- Expo Image Picker

## Funcionalidades do MVP

- Tela inicial com pet digital e saudacao personalizada
- Exibicao da data atual e periodo do dia
- Botao grande "Vamos lembrar?"
- Lista de memorias com foto, nome e parentesco
- Jogo simples de memoria com 2 ou 3 alternativas
- Recompensa com carinho e alimentacao do pet
- Tela de rotina com lembretes diarios
- Modo cuidador para nome, fotos de familiares e ativacao de lembretes
- Persistencia local em SQLite
- Estado global com Zustand
- Notificacoes locais diarias baseadas nos lembretes ativos

## Importante

- O app nao usa backend neste MVP.
- O app nao possui login neste MVP.
- O app nao usa IA neste MVP.
- O app nao substitui acompanhamento medico, terapeutico ou familiar.

## Instalacao

### Requisitos

- Node.js 20 recomendado
- npm 10+
- Expo CLI via `npx expo`
- Xcode ou Android Studio para simuladores, se desejar

### Passos

```bash
npm install
npx expo start
```

Atalhos uteis:

```bash
npm run ios
npm run android
npm run web
npm run typecheck
```

## VS Code

O projeto ja vem com configuracao pronta de workspace em [.vscode](/Users/raphaelbarros/Projects/MEMOPet/.vscode):

- `extensions.json` com extensoes recomendadas para Expo, React Native, ESLint e Prettier
- `settings.json` com formatacao ao salvar, TypeScript do workspace e imports relativos
- `launch.json` com atalhos para iniciar Expo, abrir iOS/Android e rodar typecheck
- `tasks.json` com tarefas de `install`, `start`, `ios`, `android` e `typecheck`

Extensoes recomendadas:

- `expo.vscode-expo-tools`
- `dbaeumer.vscode-eslint`
- `prettier.prettier-vscode`
- `msjsdiag.vscode-react-native`

Se o VS Code perguntar sobre as recomendacoes, basta aceitar a instalacao.

## Estrutura de pastas

```text
app/
  _layout.tsx
  memory-game.tsx
  (tabs)/
    _layout.tsx
    index.tsx
    memories.tsx
    routine.tsx
    caregiver-settings.tsx
components/
  BigButton.tsx
  MemoryCard.tsx
  PetAvatar.tsx
  RewardAnimation.tsx
  RoutineItem.tsx
  ScreenContainer.tsx
constants/
  theme.ts
lib/
  database.ts
  date.ts
  notifications.ts
stores/
  useAppStore.ts
types/
  index.ts
```

## Banco local

Tabelas criadas automaticamente na primeira execucao:

- `user_profile`
- `memories`
- `reminders`
- `pet_status`

O app tambem insere dados mockados iniciais para facilitar testes do fluxo completo.

## Fluxo do cuidador

No MVP atual, o modo cuidador permite:

- editar o nome da pessoa assistida
- adicionar foto, nome e parentesco de familiares
- ativar ou desativar lembretes
- ajustar horario de cada lembrete

## UX e acessibilidade

- Tipografia maior e legivel
- Contraste suave, mas claro
- Botoes grandes e areas de toque amplas
- Pouco texto por tela
- Linguagem acolhedora e positiva
- Feedback amigavel no quiz:
  - Acerto: "Muito bem! O pet ficou feliz."
  - Erro: "Tudo bem, vamos tentar juntos."

## Proximos passos

Veja o roadmap em [TODO.md](/Users/raphaelbarros/Projects/MEMOPet/TODO.md).

## Comandos uteis

```bash
npx expo start --clear
npx expo install
code .
```

## Licenca

Este repositório segue a licenca MIT presente em [LICENSE](/Users/raphaelbarros/Projects/MEMOPet/LICENSE).
