# Roteamento de entregas - AeD2

Esse projeto utitiza Deno + Framework Hono para montar o servidor intermediário entre Cliente e API.

No Frontend, HTML/CSS/JS puros são usados, com a biblioteca Leaflet para criar os mapas.

A aplicação foi desenvolvida e testada com Deno 2.9.7 em um ambiente WSL2 Arch Linux.
Mas qualquer versão do Deno 2.9.x deve funcionar.

## Como configurar e iniciar a aplicação

A API utilizada é a da [Open Route Service](https://openrouteservice.org/).

Para iniciar essa aplicação, é necessário a chave API associada
a uma conta criada no site citado acima ou diretamente [aqui](https://account.heigit.org/).

Crie um arquivo `.env` e adicione a seguinte linha, substituindo `{sua_chave}` pela sua chave API:
```env
API_KEY={sua_chave}
```

Depois de configurado, instale as dependências com:
```bash
deno install
```

Então, inicie a aplicação:
```bash
deno task start # Para iniciar o servidor
# OU
deno task watch # Para iniciar o servidor de desenvolvimento
```
