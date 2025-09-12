# Roteiro Falado - Aula 2: Composabilidade Raiz!

## Abertura

Olá pessoal! Sejam muito bem-vindos à segunda aula do nosso Workshop Road to Meridian 3! Eu sou o Lucas Oliveira e hoje vamos mergulhar em um dos tópicos mais empolgantes e poderosos do desenvolvimento de smart contracts: a **composabilidade**!

Vocês estão prestes a descobrir como construir aplicações descentralizadas verdadeiramente robustas e seguras. Imaginem poder combinar contratos inteligentes como se fossem peças de LEGO - cada uma com sua função específica, mas que juntas criam soluções incríveis e complexas.

Cada padrão que aprenderemos hoje é uma ferramenta poderosa que transformará vocês em verdadeiros arquitetos de soluções blockchain. Preparem-se para elevar seu conhecimento ao próximo nível!

### Programa da Aula

Hoje temos um programa repleto de conteúdo prático e valioso:

0. Primeiro, vamos relembrar quem somos e o que é o Road to Meridian
1. Começaremos explorando **Cross Contracts** - como fazer contratos conversarem entre si
2. Depois mergulharemos em **Autenticação em Profundidade** - segurança de ponta a ponta
3. Aprenderemos sobre o **Deployer Pattern** - como criar contratos de forma inteligente
4. Descobriremos o **Upgradable Pattern** - como evoluir contratos sem perder dados
5. E finalizaremos com um **Hands-on** prático para consolidar todo o aprendizado

---

## 0. Apresentação

### Quem Sou Eu

Permitam-me me apresentar rapidamente. Sou Lucas Oliveira, matemático formado em 2021, e há mais de 5 anos trabalho como Engenheiro Sênior de Blockchain. Durante minha carreira, tive o privilégio de participar da criação de Layer 1, SDKs e smart contracts tanto em ambientes EVM quanto não-EVM.

Um marco importante foi liderar a entrega de 2 projetos do DREX, o real digital brasileiro. Também sou Embaixador da Stellar no Brasil e contribuidor ativo do ecossistema open source, com mais de 3 bibliotecas crypto publicadas.

Atualmente, sou Head of Education na NearX, onde lidero iniciativas de educação blockchain na América Latina.

### Sobre a NearX

A NearX é muito mais que uma plataforma de educação. Somos uma empresa focada em tecnologias emergentes como Web3, IA e Blockchain. Oferecemos consultoria especializada em Blockchain para empresas e temos um ecossistema educacional robusto.

Nossos números falam por si: 30 alunos na nossa Pós-Graduação Lato Sensu, mais de 9.000 alunos na nossa plataforma digital, e uma comunidade vibrante de mais de 2.500 membros no Discord.

Oferecemos desde pós-graduação até mentorias individuais, bootcamps intensivos e hackathons. Temos parcerias estratégicas com gigantes como Stellar, Animoca Brands, Optimism, Arbitrum, Starknet, ZkVerify e MultiverseX.

### Sobre a Stellar

A Stellar é uma das blockchains mais estabelecidas do mercado, com mais de 13 bilhões de dólares em capitalização de mercado. Foi fundada em 2014 por Jed McCaleb, que também foi fundador da Mt. Gox e cofundador da Ripple.

O que torna a Stellar especial para nós desenvolvedores é que os smart contracts em Rust foram lançados em 2023 por Graydon Hoare, o próprio criador da linguagem Rust. Isso significa que temos uma plataforma moderna, segura e performática para construir nossas aplicações.

### O Road to Meridian

O Road to Meridian é nossa jornada estruturada de aprendizado, dividida em três workshops progressivos:

**Workshop 1** focou na Introdução ao Rust, onde aprendemos a criar e publicar bibliotecas, desenvolver APIs CRUD e integrar WebAssembly.

**Workshop 2** nos levou aos Smart contracts básicos na Stellar com Soroban, cobrindo desde o básico de blockchain até integrações com backend e frontend.

**Workshop 3**, onde estamos agora, é dedicado aos Smart contracts avançados. Na aula passada falamos sobre segurança, hoje sobre composabilidade, e na próxima implementaremos Passkey Authentication.

---

## 1. Cross Contracts

Agora vamos ao primeiro tópico principal da nossa aula: Cross Contracts. Este é verdadeiramente um dos pilares fundamentais da composabilidade no Soroban.

Pensem assim: imaginem que vocês têm uma caixa de ferramentas, e cada ferramenta tem uma função específica. Cross Contracts permite que essas ferramentas trabalhem juntas de forma coordenada e segura, criando um ecossistema interoperável de aplicações descentralizadas.

### O que é Cross Contracts?

Cross Contracts refere-se à capacidade de um contrato inteligente invocar funções de outros contratos na rede Stellar. Isso não é apenas uma funcionalidade técnica - é uma revolução na forma como pensamos sobre arquitetura de software descentralizado.

Essa capacidade nos oferece três benefícios fundamentais:

**Primeiro, a Composabilidade**: Podemos construir aplicações complexas combinando contratos menores e especializados. É como construir com blocos LEGO - cada peça tem sua função, mas juntas criam estruturas incríveis.

**Segundo, a Reutilização de código**: Por que reinventar a roda? Podemos aproveitar funcionalidades que já existem e foram testadas pela comunidade.

**Terceiro, a Modularidade**: Podemos separar responsabilidades em contratos especializados, tornando nosso código mais limpo, testável e mantível.

### Cross-Contract Call na Prática

O Soroban oferece suporte nativo para chamadas entre contratos. Vou mostrar como isso funciona na prática:

**MOSTRAR CRIACAO DA FUNCAO:**

```rust
use soroban_sdk::{contractclient, Address, Env};

#[contractclient(name = "FlipperClient")]
pub trait FlipperInterface {
    fn get(env: Env) -> bool;
    fn flip(env: Env);
}

#[contract]
pub struct TokenFactory;

#[contractimpl]
impl TokenFactory {
    pub fn get_flipper_value(env: Env, contract: Address) -> bool {
        let flipper_client = flipper::Client::new(&env, &contract);
        flipper_client.get()
    }
}
```

Vejam como é elegante! Primeiro definimos uma interface usando `#[contractclient]` que especifica quais funções queremos chamar no contrato externo. Depois, dentro do nosso contrato, criamos um cliente para o contrato externo e chamamos suas funções como se fossem locais.

Essa é a magia da composabilidade - simplicidade na interface, poder na implementação.

---

## 2. Autenticação em Profundidade

Agora vamos mergulhar em um tópico crucial para a segurança: Autenticação em Profundidade. O Soroban implementa um sistema de autenticação que é ao mesmo tempo robusto e flexível, permitindo controle granular sobre quem pode executar determinadas operações.

### Framework de Autorização Soroban

O que torna o sistema de autorização do Soroban especial são três características principais:

**Abstração de Contas**: O sistema suporta diferentes tipos de contas e assinaturas, não apenas as tradicionais chaves privadas/públicas.

**Biblioteca de Autorização**: Temos ferramentas integradas para validação de permissões, eliminando a necessidade de implementar tudo do zero.

**Regras Complexas**: Podemos implementar lógicas de autorização sofisticadas que vão muito além de simples verificações de propriedade.

### Controle de Acesso em Profundidade

Aqui está onde as coisas ficam realmente interessantes. Esse tipo de autenticação visa identificar um usuário mesmo depois de várias chamadas entre contratos.

Imaginem esta sequência: User -> Contrato-A -> Contrato-B -> Contrato-C

A pergunta crucial é: Como podemos validar no Contrato-C se o usuário original realmente assinou essa chamada?

Isso é extremamente útil em cenários do mundo real. Deixem-me dar um exemplo concreto.

### Caso Real: Soroswap

No Soroswap, quando um usuário faz uma troca de tokens (swap), a transação passa por múltiplos contratos em sequência:

1. **Router Contract** (ponto de entrada)
2. **Factory Contract** (localiza o pool correto)
3. **Pool Contract** (executa o swap efetivamente)

O Pool Contract precisa validar se o usuário original autorizou a operação, mesmo após passar por dois contratos intermediários. Isso previne manipulações não autorizadas e garante que apenas trocas legítimas sejam executadas.

Outros casos incluem sistemas de governança em DAOs, protocolos de empréstimo compostos, e plataformas de NFT com royalties em cascata.

### Deep Contract Auth na Prática

O Soroban oferece autenticação profunda através de `require_auth` e `require_auth_for_args`. Vou mostrar como implementar isso:

**MOSTRAR CRIACAO DA FUNCAO:**

[Aqui seria mostrado um exemplo de código demonstrando o uso de require_auth em um contexto de múltiplos contratos]

### Padrões de Segurança

Quatro princípios fundamentais devem guiar nossa implementação de segurança:

**1. Principle of Least Privilege**: Sempre concedam apenas as permissões mínimas necessárias. Se uma função só precisa ler dados, não deem permissão de escrita.

**2. Multi-signature**: Para operações críticas, requeiram múltiplas assinaturas. É como ter múltiplas chaves para um cofre.

**3. Time-based Access**: Implementem janelas temporais para operações sensíveis. Algumas ações só devem ser possíveis em determinados momentos.

**4. Role-based Access Control**: Definam papéis e permissões específicas. Um administrador tem permissões diferentes de um usuário comum.

---

## 3. Deployer Pattern

Vamos agora explorar o Deployer Pattern, uma estratégia fundamental para otimizar o processo de deploy de múltiplos contratos inteligentes na rede Stellar.

### O que é o Deployer Pattern?

O Deployer Pattern, também conhecido como Factory Pattern, permite que um contrato inteligente implante outros contratos dinamicamente. Pensem nisso como uma fábrica automatizada que produz contratos sob demanda.

Esse padrão oferece benefícios significativos:

**Eficiência**: Podemos fazer deploy de múltiplos contratos a partir de um único ponto, otimizando recursos e tempo.

**Padronização**: Garantimos que todos os contratos sigam as mesmas especificações e configurações.

**Controle**: Mantemos registro e controle completo sobre todos os contratos criados.

### Factory Contract Implementation

O Soroban SDK oferece funcionalidades nativas para deploy programático. Vou mostrar como implementar isso:

**MOSTRAR CRIACAO DA FUNCAO:**

[Aqui seria mostrado um exemplo de código demonstrando como criar um factory contract]

### Vantagens do Deployer Pattern

Quatro vantagens principais fazem deste padrão uma escolha inteligente:

**1. Economia de Gas**: O deploy otimizado de múltiplos contratos reduz custos significativamente.

**2. Versionamento**: Temos controle total sobre as versões dos contratos deployados, facilitando atualizações e manutenção.

**3. Configuração Centralizada**: Podemos definir parâmetros padronizados para todos os contratos, garantindo consistência.

**4. Auditoria**: Mantemos rastreabilidade completa dos contratos criados, essencial para governança e compliance.

---

## 4. Upgradable Pattern

Agora chegamos ao Upgradable Pattern, que permite que contratos inteligentes sejam atualizados após o deploy, mantendo o mesmo endereço e estado. Este padrão é crucial para correção de bugs, melhorias de funcionalidade e evolução de aplicações.

### Estratégias de Upgrade no Soroban

O Soroban oferece diferentes abordagens para implementar contratos atualizáveis:

**Proxy Pattern**: Separamos lógica de dados usando contratos proxy. O proxy mantém o estado enquanto a lógica pode ser atualizada.

**Diamond Pattern**: Modularizamos funcionalidades em múltiplos contratos, permitindo atualizações granulares.

**Versioning Pattern**: Mantemos múltiplas versões com migração controlada entre elas.

### Implementação do Proxy Pattern

O padrão mais comum utiliza um contrato proxy que delega chamadas para contratos de implementação:

**MOSTRAR CRIACAO DA FUNCAO:**

[Aqui seria mostrado um exemplo de código demonstrando a implementação do proxy pattern]

### Boas Práticas para Upgrades

Cinco práticas essenciais devem ser seguidas:

**1. Governança**: Implementem mecanismos de governança para aprovação de upgrades. Não permitam que uma única pessoa tenha poder total.

**2. Timelock**: Adicionem delays para upgrades críticos. Isso dá tempo para a comunidade revisar e reagir se necessário.

**3. Migração de Estado**: Planejem estratégias para migração de dados. Como os dados existentes serão tratados na nova versão?

**4. Testes Rigorosos**: Validem upgrades em ambientes de teste antes de aplicar em produção. Nunca testem em produção!

**5. Rollback**: Mantenham capacidade de reverter upgrades problemáticos. Sempre tenham um plano B.

---

## 5. Hands-on

Agora vamos colocar a mão na massa! Para consolidar tudo o que aprendemos, vamos criar um projeto prático que incorpora todos os conceitos:

- Cross Contract
- Autenticação em profundidade
- Deployer Pattern
- Upgradable Pattern

### O Projeto: Plataforma de Gestão de Tarefas

Nosso projeto será uma plataforma de gestão de tarefas com as seguintes características:

- É possível comprar um app de gestão de tarefas individual
- Apenas o Admin pode sacar o valor da plataforma de venda de apps
- Apenas o dono do app pode adicionar tarefas
- Deve ser possível atualizar o app
- Apenas o dono do app pode atualizar ele
- Na v2 deve ser possível adicionar tarefas em outros apps desde que seu dono assine
- Na v2 deve ser possível ver tarefas de outros apps

Este projeto é perfeito porque incorpora todos os padrões que estudamos hoje de forma prática e realista.

**MOSTRAR TERMINAL:** `cd projects`

**MOSTRAR ARVORE DE ARQUIVOS:**

[Aqui seria mostrada a estrutura de arquivos do projeto]

**MOSTRAR CRIACAO DE MODULO:**

[Aqui seria mostrado o desenvolvimento passo a passo dos contratos]

Vamos implementar juntos, explicando cada decisão arquitetural e como ela se relaciona com os padrões aprendidos.

---

## Revisão

Vamos recapitular tudo que aprendemos hoje. Foi uma jornada intensa e repleta de conhecimento!

### 1. Cross Contracts

✅ **Composabilidade** permite construir aplicações complexas combinando contratos menores - como blocos LEGO digitais

✅ **Cross-contract invocation** através de `env.invoke_contract()` para chamadas seguras entre contratos

✅ **Padrões de interoperabilidade**: Interface Contracts, Proxy Patterns e Registry Patterns para diferentes necessidades

✅ **Modularidade e reutilização** de código como benefícios principais para desenvolvimento eficiente

### 2. Autenticação em Profundidade

✅ **Framework de autorização Soroban** com abstração de contas e regras complexas para máxima flexibilidade

✅ **`require_auth()`** como mecanismo principal para validação de autenticação robusta

✅ **Suporte para multi-signature** e autenticação de múltiplos usuários em cenários complexos

✅ **Padrões de segurança**: Least Privilege, Time-based Access, Role-based Access Control para proteção completa

### 3. Deployer Pattern

✅ **Factory Pattern** permite deploy programático de múltiplos contratos de forma eficiente

✅ **`env.deployer()`** para criação dinâmica de contratos com salt e wasm_hash

✅ **Vantagens**: economia de gas, versionamento, configuração centralizada para otimização de recursos

✅ **Controle e auditoria** completa dos contratos deployados para governança transparente

### 4. Upgradable Pattern

✅ **Proxy Pattern** para separar lógica de dados em contratos atualizáveis sem perda de estado

✅ **Estratégias**: Proxy, Diamond e Versioning Patterns para diferentes necessidades de upgrade

✅ **Boas práticas**: governança, timelock, migração de estado, testes rigorosos para upgrades seguros

✅ **Capacidade de rollback** para reverter upgrades problemáticos e manter estabilidade

### 5. Hands-on

✅ **Exercícios práticos** implementando cross-contract communication em cenários reais

✅ **Sistema de autenticação multi-nível** com roles e permissões para segurança robusta

✅ **Factory contract** para deploy automatizado de tokens com configurações personalizadas

---

## Lição de Casa

Agora é hora de colocar em prática tudo que aprendemos! Preparei desafios em três níveis para vocês:

### Desafio de Aprendizagem

**Fácil**: Implementem um contrato que use `require_auth()` para proteger uma função de transferência de tokens. Testem com diferentes usuários e vejam como o sistema de autenticação funciona na prática.

**Médio**: Criem um sistema de factory contract que possa deployar contratos de votação com diferentes configurações - duração, opções, quorum mínimo. Isso vai exercitar tanto o deployer pattern quanto a configuração dinâmica.

**Difícil**: Desenvolvam um contrato upgradeable usando proxy pattern que mantenha estado durante upgrades. Implementem governança com timelock para aprovação de upgrades. Este é um desafio completo que integra vários conceitos!

### Recursos de Estudo

Para apoiar vocês nesta jornada, aqui estão os melhores recursos:

**Documentação Oficial**:
- Soroban Documentation - documentação completa e sempre atualizada
- Stellar Developer Portal - portal oficial com tutoriais e guias
- Soroban SDK Rust Docs - referência técnica detalhada

**Exemplos e Tutoriais**:
- Soroban Examples no GitHub - exemplos oficiais testados
- Soroban How-To Guides - guias práticos passo a passo
- Stellar DApp Examples - exemplos completos de aplicações

**Ferramentas de Desenvolvimento**:
- Stellar CLI - ferramenta essencial de linha de comando
- Soroban RPC - referência completa da API
- Stellar Build - plataforma integrada de desenvolvimento

### Desafio de Carreira

Compartilhem seu aprendizado com o mundo! Façam um post no LinkedIn e Twitter sobre padrões de segurança em smart contracts usando #road2meridian #SorobanSecurity.

Marquem a @StellarOrg e destaquem qual padrão mais impressionou vocês. Marquem também a @NearX_Official e compartilhem seu progresso no workshop.

Essa visibilidade é importante para suas carreiras e ajuda a fortalecer nossa comunidade!

### Desafio de Comunidade

A aprendizagem é mais rica quando compartilhada:

- Compartilhem seu código do exercício hands-on no Discord da NearX com uma explicação clara
- Ajudem um colega com dúvidas sobre autenticação ou cross contracts no Discord da Stellar
- Postem uma dica de segurança que aprenderam hoje nos grupos de estudo

Lembrem-se: ensinar é uma das melhores formas de aprender!

---

## Próxima Aula

Na próxima aula, vamos explorar **O Frontend do Futuro com Passkey**! Será nossa última aula do Workshop 3, e prometo que será espetacular.

Vamos aprender como implementar autenticação sem senhas, usando tecnologias de ponta que estão revolucionando a experiência do usuário em aplicações Web3.

Até lá, pratiquem os conceitos de hoje, façam os exercícios e nos vemos na próxima aula!

Obrigado pela atenção e dedicação de vocês. Continuem construindo o futuro!