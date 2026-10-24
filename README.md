# Finnitus — Site oficial

**Organize seu salário. Antecipe seus gastos. Decida melhor.**

Landing page institucional do Finnitus, projeto de TCC 2026. Desenvolvida em **HTML, CSS e JavaScript** com layout responsivo, animações, mascote Finn e uma demonstração horizontal das funcionalidades.

## Estrutura

```text
finnitus-site/
├── index.html       # Seções e conteúdo
├── styles.css       # Estilos, responsividade e animações
├── script.js        # Menu, scrollview, FAQ, links e formulário
├── assets/          # Logotipo e poses do Finn
├── .nojekyll        # Publicação estática no GitHub Pages
├── .gitignore
└── README.md
```

## Como executar

Abra a pasta no VS Code e use a extensão **Live Server** no arquivo `index.html`. Não é necessário `npm install`.

## Colocar no GitHub pela primeira vez

1. Crie um repositório **finnitus-site** em https://github.com/new.
2. Escolha `Public` se pretender publicar pelo GitHub Pages no plano gratuito.
3. **Não** marque as opções para criar README, .gitignore ou licença automaticamente (já temos README e .gitignore).
4. Abra esta pasta no terminal do VS Code e rode:

```powershell
git init
git branch -M main
git add .
git commit -m "Cria site institucional do Finnitus"
git remote add origin https://github.com/SEU_USUARIO/finnitus-site.git
git push -u origin main
```

Troque `SEU_USUARIO` pelo seu usuário do GitHub. Pode ser necessário entrar na sua conta para autorizar o envio.

### Alternativa sem terminal

No repositório recém-criado, use **Add file → Upload files** e envie o conteúdo desta pasta, **não o ZIP**. Preserve `index.html`, `styles.css`, `script.js` e a pasta `assets` na raiz.

## Publicar no GitHub Pages

Com os arquivos enviados:

1. Abra o repositório no GitHub.
2. Entre em **Settings → Pages**.
3. Em **Build and deployment**, selecione **Deploy from a branch**.
4. Em **Branch**, escolha `main`, pasta `/(root)`, e salve.

O endereço normalmente será `https://SEU_USUARIO.github.io/finnitus-site/`.

**Atenção:** o GitHub Pages é público. Não adicione senhas, tokens, dados financeiros reais ou informações privadas ao repositório ou ao site.

## Como trabalhar em equipe

Para convidar as integrantes, entre em **Settings → Collaborators → Add people**, escolha as contas do GitHub e peça que aceitem os convites.

Para trabalhar com segurança, cada integrante pode criar sua branch e abrir um Pull Request:

```powershell
git checkout -b ajuste/funcionalidades
# Edite e salve os arquivos
git add .
git commit -m "Melhora demonstracao de funcionalidades"
git push -u origin ajuste/funcionalidades
```

Depois, revisem e mesclem as alterações à branch `main`. Ao começar a trabalhar, atualizem a branch local com `git pull`.

## Conteúdos que ainda precisam ser substituídos

No início do `script.js`, configure:

- `playStoreUrl`: link oficial de download, após publicação;
- `videoUrl`: link do vídeo oficial ou arquivo MP4;
- `contactEmail`: e-mail oficial;
- `instagramUrl` e `instagramLabel`: Instagram oficial.

As telas do aplicativo na área demonstrativa contêm **dados ilustrativos**. Fotos da equipe e depoimentos deverão ser incluídos com autorização.

O formulário de contato usa `mailto:` — ele não envia mensagens sozinho e exige o e-mail configurado.

## Identidade visual

Tipografia: **Sansation + Raleway**. Cores principais: roxos `#420090`, `#320B59` e `#6601F5`; verdes `#82DC00` e `#B7FF00`; lavanda `#C2AFFF`; laranja `#FF8800` apenas como apoio.

Este repositório contém apenas o site institucional, separado do aplicativo e de seu backend.
