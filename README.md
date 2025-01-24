# Summary Wapp

Aplicação que cria resumos do dia para auxiliar participantes de grupos de WhatsApp a se manterem atualizados sobre o que aconteceu no dia.

## Requisitos

- Docker
- Chave API do Google Gemini
- Node.js v20+ (Opcional)

## Instalação de produção

1. Clone o repositório

2. Duplique o arquivo .env.example e renomeie para .env

3. Configure suas respectivas variáveis de ambiente

   > OBS: Para gerar a chave API do Google Gemini, acesse o link https://aistudio.google.com/apikey

4. Crie um arquivo dentro de `src/` chamado `summary.conf.ts` exportando o objeto `summaryConfig`, com o seguinte formato:

```ts
export const summaryConfig = {
  // tempo em milissegundos do intervalo para gerar novos resumos
  interval: 2 * 60 * 60 * 1000, // 2 horas
  // palavras chaves para gerar resumos
  keywords: ["#palavra1", "#palavra2"],
  // grupos permitidos para gerar resumos
  allowedGroups: ["123456@g.us", "654321@g.us"],
};
```

> OBS: Você poderá pegar os ids de `allowedGroups`, logo mais, ao executar a aplicação, na rota de `http://localhost:3001/groups`

5. Inicie a aplicação com o comando `docker compose up -d`

6. Acesse o manager para criar uma nova instância do seu bot
   a. Acesse o link http://localhost:8080/manager
   b. Faça login usando a url do servidor do manager, e em TOKEN, utilize o valor que está na chave de `AUTHENTICATION_API_KEY` do arquivo .env.evolution
   c. Crie uma nova instância com seu número de telefone e guarde o nome da instância (não utilize espaços e caracteres especiais). No campo de token/apikey, coloque o valor de `EVOLUTION_API_KEY`do arquivo .env
   d. Acesse a página da sua instância e autentique seu WhatsApp lendo o QR Code
   e. Acesse o arquivo `.env` e altere o valor de `EVOLUTION_INSTANCE_ID`para o nome da instância que você criou

7. Reinicie toda a aplicação:

- Execute `docker compose down --rmi local --remove-orphans`
- Execute `docker compose up -d --build`

8. Acesse o link http://localhost:3001/groups para ver os grupos que você pode gerar resumos, pegue o id dos grupos que você quer gerar resumos e adicione no arquivo ao array `allowedGroups` no arquivo `src/summary.conf.ts`

9. Repita o passo 7, para reiniciar a aplicação

10. Se você sobreviveu até aqui, parabéns! Agora faça um teste, envie sua palavra chave em um dos grupos que você configurou e veja se o resumo foi gerado. (Pode levar até 1 minuto para gerar o resumo)
