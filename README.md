# Roteamento de entregas - AeD2

Esse projeto utitiza Node + Framework Hono para montar o servidor intermediário entre Cliente e API.

No Frontend, Svelte5 foi utilizado, com as bibliotecas Sveaflet + Leaflet para criar os mapas.

> [!NOTE]
> A parte do SvelteKit na aplicação delega toda requisição para o servidor Hono.
> Portanto, é simples desacoplar a API do frontend em Svelte e integrar com outar biblioteca/framework.

A aplicação foi desenvolvida e testada com Node v24.19.0 em um ambiente WSL2 Arch Linux.
Mas qualquer versão do Node v24.x.x deve funcionar.

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
npm install
```

Então, inicie a aplicação:
```bash
npm run build # Para compilar a aplicação
node build    # Para iniciar a aplicação compilada
# OU
npm run dev # Para iniciar o servidor de desenvolvimento
```

Qualquer configuração sobre a implantação com Node como porta, IP, etc. pode ser vista na [documentação oficial](https://svelte.dev/docs/kit/adapter-node)
