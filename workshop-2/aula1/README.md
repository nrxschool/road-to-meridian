# Roteiro Falado - Workshop: Road to Meridian 2

## Dia 1: Introdução a Smartcontracts em Rust para Stellar

---

## Abertura

Olá pessoal! Sejam muito bem-vindos ao Workshop: Road to Meridian 2! É um prazer imenso ter vocês aqui hoje. Meu nome é Lucas, e vou ser o instrutor de vocês nesta jornada incrível.

Hoje vamos mergulhar de cabeça no mundo dos smartcontracts na Stellar Network usando Rust. Se você nunca trabalhou com blockchain antes, não se preocupe - esta aula foi desenhada especificamente para colocar todos na mesma página. Vamos começar pelos conceitos fundamentais de blockchain, depois vou apresentar vocês à Stellar Network, explicar como funcionam os smartcontracts neste ecossistema, e no final da aula, cada um de vocês vai fazer seu primeiro deploy de um contrato inteligente!

A proposta é que ao final desta aula, vocês tenham uma base sólida para continuar desenvolvendo na Stellar. Então vamos começar!

### Programa da aula

Hoje nossa jornada está dividida em 5 grandes blocos:

Primeiro, no bloco 0, vou me apresentar, falar sobre a NearX, sobre a Stellar e explicar o que é este programa Road to Meridian que estamos iniciando juntos.

No bloco 1, vamos abordar os Conceitos Fundamentais de Blockchain - isso é essencial para quem está começando, pois blockchain tem seus próprios conceitos e terminologias.

No bloco 2, mergulharemos na Stellar Network, uma blockchain especializada em pagamentos globais, e vocês vão entender por que ela é tão especial.

No bloco 3, vamos falar sobre Smartcontracts na Stellar com Soroban - a plataforma de contratos inteligentes da Stellar que usa Rust.

E finalmente, no bloco 4, vamos colocar a mão na massa e fazer o deploy do nosso primeiro Hello World na blockchain!

---

## 0. Quem somos e o que é o Road to Meridian

### Apresentação - Lucas Oliveira

Então, deixe-me me apresentar melhor. Meu nome é Lucas Bispo de Oliveira, sou matemático e há mais de 5 anos trabalho como Engenheiro Senior de Blockchain.

Durante minha carreira, tive a oportunidade de trabalhar na criação de Layer 1 - que são blockchains inteiras -, desenvolvi SDKs, que são kits de desenvolvimento para facilitar a vida de outros programadores, e criei smart contracts tanto para redes EVM quanto não-EVM. Inclusive, liderei a entrega de 2 projetos para o DREX, que é o Real Digital do Banco Central.

Sou Embaixador da Stellar aqui no Brasil, o que significa que represento oficialmente esta blockchain incrível no nosso país. Também sou contribuidor ativo de projetos open source, tendo publicado diversas bibliotecas de criptografia que qualquer pessoa pode usar.

Atualmente, sou Head of Education na NearX, onde lidero toda a área de educação em blockchain na América Latina.

### NearX - Nossa Plataforma de Educação

A NearX é uma plataforma de educação especializada em tecnologias emergentes como Web3, Inteligência Artificial e Blockchain. Além da educação, também oferecemos consultoria em Blockchain para empresas que querem implementar essas tecnologias.

Nossos números mostram o impacto que estamos causando: temos 30 alunos em nossa Pós-graduação Lato Sensu, mais de 9.000 alunos em nossa plataforma digital, e uma comunidade de mais de 2.500 membros ativos no Discord.

Oferecemos uma gama completa de serviços educacionais: desde pós-graduação formal até nossa plataforma por assinatura, mentorias individuais, bootcamps intensivos como esse que vc está fazendo e hackathons como o que vamos fazer juntos em Setembro!

E o que mais me orgulha são nossas parcerias estratégicas com gigantes do mercado como Stellar, Animoca Brands, Optimism, Arbitrum, Starknet, ZkVerify e MultiverseX. Essas parcerias garantem que nosso conteúdo esteja sempre alinhado com as melhores práticas do mercado.

### Stellar - A Blockchain que Vamos Usar

Agora, deixe-me falar sobre a Stellar, a blockchain que será o foco do nosso workshop.

A Stellar tem uma capitalização de mercado de mais de 13 bilhões de dólares, o que a coloca entre as top 10 blockchains do mundo.

Foi fundada em 2014 por Jed McCaleb, que não é qualquer pessoa - ele foi o fundador da Mt. Gox e co-fundador da Ripple. Ou seja, tem uma experiência imensa no mundo das criptomoedas.

Uma informação muito importante: os smartcontracts em Rust na Stellar foram lançados oficialmente em 2023, desenvolvidos por Graydon Hoare, que também foi o criador original da linguagem Rust. Isso significa que estamos trabalhando com tecnologia de ponta, criada pelos melhores especialistas do mundo. Além disso, ela ainda é extremamente nova, então qualquer pessoa pode se tornar um especialista na plataforma, assim como eu, porque simplesmente quase não há desenvolvedores atuando nela!

### Road to Meridian - Nossa Jornada Completa

O Road to Meridian é um programa educacional completo que eu desenvolvi para levar vocês do básico ao avançado no desenvolvimento blockchain com Rust e Stellar.

O programa está dividido em 3 workshops progressivos:

O Workshop 1, que já concluímos, foi uma Introdução ao Rust, onde vocês aprenderam a criar e publicar bibliotecas, desenvolver APIs CRUD, e trabalhar com WebAssembly.

Agora estamos no Workshop 2, focado em Smartcontracts Básico na Stellar com Soroban. Na aula de hoje vamos ver o básico de blockchain e fazer nosso primeiro Hello World. Na próxima aula vamos integrar smartcontracts com backend, e na terceira aula faremos a integração com frontend.

E por último, teremos o Workshop 3, que é o mais avançado, focado em Smartcontracts Avançado. Lá vamos abordar segurança em smartcontracts, composabilidade entre protocolos Soroban, e até implementar autenticação com Passkey.

---

## 1. Conceitos Fundamentais de Blockchain

Agora que vocês me conhecem e conhecem o programa, vamos começar com o conteúdo técnico. Para entender smartcontracts, precisamos primeiro dominar os conceitos básicos de blockchain. É como aprender uma nova linguagem - precisamos conhecer o vocabulário básico antes de formar frases complexas.

Vou apresentar vocês aos pilares fundamentais de qualquer blockchain, seguindo esta sequência lógica: Wallets, depois Transações, em seguida Blocos, depois Consenso, e finalmente chegaremos aos Smartcontracts.

Esta é a sequência que representa o fluxo natural de como as coisas acontecem em uma blockchain.

### Carteiras (Wallets)

> Vamos começar pelas carteiras, ou wallets em inglês.

Uma carteira não é como sua carteira física que guarda dinheiro. Na blockchain, a carteira é um software que gerencia suas chaves privadas e públicas.

É importante entender: ela não armazena moedas, apenas as chaves de acesso que provam que você é dono daqueles ativos. Por isso é fundamental entender que se você perder sua chave privada, você perde acesso aos seus ativos para sempre. Não existe "esqueci minha senha" na blockchain!

O ciclo de vida de uma carteira é bem simples:

1. Primeiro, ela cria um par de chaves - uma pública e uma privada. A chave pública é como seu email, que todos podem ver. A chave privada é como sua senha, que só você deve conhecer.
2. Segundo, quando você quer fazer uma transação, a carteira assina essa transação com sua chave privada, provando que você é realmente o dono dos recursos.
3. Terceiro, ela envia essa transação assinada para a blockchain para ser processada.

Mas quais tipos de transações podemos fazer?

### Transações

> Agora vamos falar sobre transações.

Uma transação é basicamente uma instrução que você dá para a blockchain fazer alguma coisa: transferir tokens, criar uma conta, executar um contrato inteligente, etc.

Aqui na Stellar, algo interessante é que podemos colocar até 100 operações em uma única transação. Isso significa que você pode, por exemplo, criar uma conta, transferir tokens e executar um contrato, tudo em uma única transação.

O custo para processar cada operação é de 100 stroops - vou explicar o que são stroops daqui a pouco -, então uma transação com 3 operações custaria 300 stroops.

O ciclo de vida de uma transação segue estes passos:

1. Criação: Você define o que quer fazer
2. Assinatura: Sua carteira assina com a chave privada
3. Broadcast: A transação é enviada para a rede
4. Validação: Os nós da rede verificam se está tudo correto
5. Inclusão em um bloco: A transação é incluída no próximo bloco
6. Confirmação final: A transação torna-se irreversível

Mas onde essas transações ficam armazenadas e como são organizadas na rede?

### Blocos

> Vamos agora entender o que são blocos.

Um bloco é o conjunto de transações agrupadas em um único ledger. Cada bloco contém um conjunto de operações que são executadas na ordem em que foram incluídas.

Cada bloco possui:

- Header: metadados do ledger, como timestamp, hash, merkle root e parâmetros de consenso.
- Body: conjunto ordenado de transações, cada uma com sua lista de operações validadas.

Na Stellar, cada ledger pode conter até 2000 operações por padrão, e um novo ledger é produzido a cada 5–7 segundos. Isso resulta em aproximadamente 8.600 a 10.300 ledgers por dia.

Blockchain é a sequência cronológica e imutável de blocos, encadeados criptograficamente por meio de um hash.

O Storage (ou armazenamento) é o conjunto de dados persistentes mantidos na Blockchain como saldos, contratos, ou seja o estado atual da rede.

Já o estado é a representação consistente de todas as contas, saldos, configurações e dados de contratos em um determinado número de ledger.

O Estado vária a cada bloco, pois cada nova transação modifica o estado da rede.

A modificação do estado tem um nome teórico: State Transition Function (STF). Ela é uma função determinística que recebe o estado atual e o conjunto ordenado de transações do bloco e retorna o próximo estado. Ela garante que todos os nós cheguem ao mesmo resultado quando processam o mesmo bloco.

Mas como podemos garantir que todos os nós da rede concordem sobre o próximo estado?

### Consenso

> Agora para fechar esse bloco **<TROCADILHO>**, vamos falar sobre consenso.

Consenso é como os nós da rede concordam sobre qual é o estado correto da blockchain. É um dos problemas mais complexos da ciência da computação distribuída.

Existem vários tipos de consenso:

Proof of Work (PoW): como no Bitcoin, onde mineradores competem usando poder computacional.

Proof of Stake (PoS): como no Ethereum atual, onde mineradores competem usando poder monetário.

Stellar Consensus Protocol (SCP): que é único e usa um conceito de reputação. É um protocolo federado bizantino onde mineradores competem usando poder de reputação e confiança mútua.

O SCP é especialmente eficiente porque permite consenso sem mineração (PoW) ou staking (PoS), garantindo transações atômicas e irreversíveis em segundos.

Pode paracer que não, mas é só isso.

Todas as Blockchain se baseam nesses 4 conceitos: Wallets, Transações, Blocos e Consenso. Assim como toda linguagem de programação é igual no sentido que tem ifelse, loops, funcoes e classes. Mas cada uma tem sua peculiaridade.

Existem muitos conceitos e detalhes de cada infraestrutura mas com esses 4 pontos podemos avançar sem tropeços. 80/20.

## 2. Stellar Network: A Blockchain para Pagamentos Globais

Agora vamos mergulhar na Stellar Network especificamente. A Stellar é uma blockchain focada em pagamentos globais rápidos e baratos, e vamos entender suas características únicas que a tornam especial neste mercado.

### Tokenomics

> Vamos começar pela tokenomics da Stellar, que representa a distribuição e economia dos tokens XLM na rede.

Em novembro de 2019, a Stellar Development Foundation (SDF) realizou uma queima de tokens, removendo permanentemente 55 bilhões de XLM da circulação. Isso ocorreu após o suprimento total ter crescido para cerca de 105 bilhões devido ao mecanismo de inflação anual de 1% (que foi desativado na mesma ocasião), reduzindo o total para 50 bilhões.

Atualmente, temos 31.28 bilhões de XLM em circulação no mercado, o que resulta em uma capitalização de mercado de 13.84 bilhões de dólares. O volume de 24 horas é de aproximadamente 557.8 milhões de dólares, mostrando que há bastante atividade de trading.

Essa queima de tokens foi uma decisão estratégica para tornar o XLM mais escasso e potencialmente mais valioso, além de simplificar o modelo econômico da rede.

### Wallet na Stellar

> Agora vamos entender como funcionam as carteiras especificamente na Stellar.

A Stellar utiliza a curva elíptica Ed25519 para assinaturas digitais, conhecida por sua segurança e eficiência. Diferentemente de outras blockchains, como o Bitcoin, que usam SHA-256 e RIPEMD-160 para derivar endereços, na Stellar, o endereço da conta é a chave pública codificada diretamente no formato strkey (prefixo "G").

As carteiras mais populares para Stellar são Freighter e Lobstr. Freighter é uma extensão de navegador, ideal para desenvolvedores devido à sua integração com ferramentas como o Stellar SDK, enquanto Lobstr é um aplicativo mobile conhecido por sua interface amigável e voltada para usuários finais.

A Stellar possui três redes principais: PublicNet (a rede principal), TestNet (para desenvolvimento e testes) e PreviewNet (para testar funcionalidades experimentais, como upgrades de protocolo e contratos inteligentes via Soroban).

PublicNet (ou Mainnet): rede principal com tokens de valor real (XLM), ledgers independentes e contínuos desde o lançamento.

TestNet: similar à PublicNet em estrutura, mas com tokens sem valor real (para testes), ledgers independentes (pode ser resetada, resultando em altura diferente).

Futurenet: rede de desenvolvimento diferente das outras, para testar novas funcionalidades experimentais (como upgrades de protocolo), com tokens sem valor e ledgers independentes.

Uma diferença importante da Stellar para o mundo EVM: a Stellar usa a chave pública diretamente como endereço da conta (codificada no formato strkey), enquanto no Ethereum e outras redes EVM, o endereço é derivado da chave pública por meio da função hash Keccak-256, utilizando os últimos 20 bytes do resultado.

A Stellar adota um Account Based Model e além disso cada conta precisa ser criada na blockchain antes de receber ativos, mesmo que você possua chaves offline. Para criar uma conta, é necessário depositar uma reserva base de 1 XLM, mais 0.5 XLM para cada trustline ou entrada adicional, como para cada tipo de ativo que você deseja receber.

### Transações na Stellar

> Vamos entender como funcionam as transações especificamente na Stellar.

A Stellar suporta 26 tipos diferentes de operações. Veja, é possivel fazer diversas operações dentro de uma mesma transação. Uma transação suporta 100 operações.

A taxa base é de 100 stroops por operação, que equivale a 0.00001 XLM. Se sua transação tem múltiplas operações, o custo total será n × 100 stroops, onde n é o número de operações.

Deixe-me explicar o que são stroops: Stroop é a menor unidade de XLM. 1 XLM equivale a 10.000.000 stroops, e 1 stroop equivale a 0.0000001 XLM. É como centavos para o real, mas com mais casas decimais.

Entre as operações mais importantes temos:

- Create Account: cria e financia uma nova conta
- Payment: transfere ativos entre contas
- Change Trust: gerencia trustlines para ativos personalizados
- Invoke Host Function: executa contratos inteligentes Soroban

Mas e se uma operação falhar dentro de um transação com várias operações?

Em geral não são todas as blockchain que suportam multiplas operações dentro de uma mesma transação. A Stellar é uma delas.

Uma transação não pode falhar. Ou ela é bem-sucedida, ou não é executada. Isso se chama atomicidade.

Atomicidade significa que todas as operações dentro de uma transação devem ser executadas com sucesso, ou nenhuma delas é executada. É tudo ou nada.

Se qualquer operação dentro da transação falhar, todas as operações são revertidas como se nunca tivessem acontecido. Se apenas uma das operações fosse executada, teríamos inconsistências graves no estado da rede.

### Blocos na Stellar

> Na Stellar, os blocos são chamados de ledgers.

Cada ledger tem um limite padrão de 2000 operações, e um novo ledger é criado a cada 5-7 segundos. Isso resulta em aproximadamente 8.600 a 10.300 ledgers por dia, garantindo alta throughput para a rede.

### Consenso na Stellar

> O consenso da Stellar merece uma atenção especial.

O Stellar Consensus Protocol (SCP) é um protocolo de acordo bizantino federado (FBA) com membresia aberta. Isso significa que nós da rede configuram "fatias de quórum" - grupos de outros nós em quem confiam - para alcançar consenso global sem mineração ou stake.

Este protocolo garante transações atômicas e irreversíveis em segundos, não em minutos como outras redes.

Os números da performance são impressionantes: a rede suporta mais de 3,3 milhões de contas, processa mais de 15 TPS (transações por segundo), tem um tempo de consenso de apenas 1.061 milissegundos, e atualiza o ledger em apenas 46 milissegundos.

Agora vou mostrar algumas imagens que ilustram graficamente como funciona o consenso SCP:

[Imagem 1 — Mostra as Fases do SCP]

1. Surge conflito entre X (topo) e Y (base). Cada nó vota conforme suas quorum slices (conjuntos de nós em quem confia).
2. No topo, os pares de 1 ({2,3,4}) formam maioria para X. Na base, 5 vê 6 e 7 em Y, então inicia em Y, 2 votos em Y e 1 em X.
3. O subconjunto {1,2,3,4} já aceita X (pois atingiu o threshold do slice, já explico isso). Então isso cria um “núcleo” consistente em X.
4. Para o nó 5, o nó 1 é ponto de interligação com o resto da rede. Como 1 já aceitou X, {1} torna-se um bloqueio para {5}.
5. O nó 5 vê que Y está inseguro para ele, então ele migra de Y → X para manter segurança e não divergir do seu conjunto de bloqueio e não travar o progresso da rede. A base acompanha e a rede externaliza X.

[Imagem 2 — Fatias de quórum e limiares (thresholds)]

A hierarquia de quorum slices é a base do consenso e se divide em:

- Critical (100%) que é o nível mais alto, onde a confiança é total e não pode haver divergência.
- High / Medium / Low (67%): camadas intermediárias que exigem maioria qualificada (2/3).

[Imagem 3 — Topologia da rede de Quorum Slices do SCP]

- Mapa da confiança: centro bem conectado; periferia com menos ligações.
- Mais conexões = mais interseção = consenso mais rápido e seguro.
- Nós isolados participam menos e pois tem qualidade menor.
- Ideia central: o consenso nasce das escolhas locais de confiança e se propaga para toda a rede.

---

## 3. Smartcontracts na Stellar com Soroban

Agora chegamos ao coração do nosso workshop: os smartcontracts na Stellar. A plataforma se chama Soroban, e ela foi projetada com foco em três pilares essenciais: Desempenho, Sustentabilidade e Segurança.

### O que é Soroban?

> Vou explicar o que torna o Soroban especial.

O Soroban foi lançado na mainnet em março de 2024, então estamos falando de tecnologia muito recente. Ele usa WebAssembly (Wasm) como runtime, o que permite alta performance e portabilidade.

A linguagem principal é Rust, mas tecnicamente qualquer linguagem que compile para Wasm pode ser usada. O Soroban tem integração nativa com a Stellar Network, aproveitando toda a infraestrutura já estabelecida.

O ecossistema está crescendo rapidamente: já temos mais de 150 projetos financiados pela Stellar Development Foundation, que disponibilizou um fundo de 100 milhões de dólares para apoiar o desenvolvimento.

Recursos técnicos avançados incluem processamento paralelo, concorrência sem conflitos entre transações, e um sistema de taxas multidimensionais que cobra por diferentes recursos (CPU, memória, armazenamento, etc.).

### Por que Rust?

> Uma pergunta que sempre surge é: por que usar Rust?

Rust oferece várias vantagens fundamentais:

- Segurança de memória sem garbage collector, evitando vazamentos e erros comuns
- Performance próxima ao C/C++, ideal para blockchain onde performance é crítica
- Sistema de tipos robusto que previne muitos bugs em tempo de compilação
- Comunidade ativa e crescente, com excelente documentação

A combinação Rust + WebAssembly é perfeita para Soroban:

- Temos uma DSL (Domain Specific Language) específica do Soroban
- Compilação eficiente diretamente para Wasm
- Execução determinística, essencial para consenso blockchain
- Portabilidade entre plataformas

### VMs e Runtimes

> Vamos entender por que WebAssembly foi escolhida.

WebAssembly (Wasm) oferece:

- Bytecode portável e extremamente eficiente
- Sandbox seguro para execução, isolando contratos
- Suporte a múltiplas linguagens de programação
- Alta performance, próxima ao código nativo

Para contextualizar, existem outras VMs no mercado blockchain:

- eBPF: usado para programas no kernel Linux, usado na Solana
- RISC-V: arquitetura de processador aberta, usado na Cartesi
- EVM: Ethereum Virtual Machine
- Move: linguagem da Diem/Aptos
- Cairo: linguagem da StarkNet

Cada uma tem suas vantagens, mas Wasm oferece o melhor equilíbrio entre performance, segurança e facilidade de uso.

### Ferramentas de Desenvolvimento

> Para desenvolver no Soroban, temos um conjunto robusto de ferramentas:

- Stellar CLI: interface de linha de comando para todas as operações
- Soroban SDK (Rust): biblioteca principal para escrever contratos
- Stellar SDK: disponível em JavaScript e Python para integração com aplicações

---

## 4. Deploy do Primeiro Hello World com Soroban

Agora chegou o momento que vocês estavam esperando: vamos colocar a mão na massa! Vamos criar nosso primeiro smart contract, com o objetivo de fazer um Hello World na rede Stellar usando as ferramentas que acabamos de apresentar: Rust, Soroban CLI e Stellar SDK.

### Ciclo de Desenvolvimento Soroban

> Primeiro, deixe-me apresentar o ciclo completo de desenvolvimento no Soroban:

1. Configuração: Criar conta e adicionar faucets (tokens de teste)
2. Escrever: Desenvolvimento do contrato em Rust
3. Compilar/Otimizar: Gerar o arquivo WebAssembly
4. Testar: Validar o funcionamento localmente
5. Deploy: Implantar o contrato na rede (dividido em duas etapas):
   a. Upload: Carregar o bytecode do contrato na rede
   b. Install: Inicializar uma instância específica do contrato
6. Interagir: Executar as funções do contrato

Este é o fluxo que todo desenvolvedor Soroban segue, desde a ideia até a aplicação funcionando na blockchain.

### 4.0 Instalar e Configurar Dependências

> Vamos começar configurando nosso ambiente de desenvolvimento.

Primeiro, precisamos instalar o Rust:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Este comando baixa e instala o Rust e o Cargo (gerenciador de pacotes do Rust) no seu sistema.

Em seguida, precisamos adicionar o target WebAssembly:

```bash
rustup target add wasm32-unknown-unknown
```

Este target é necessário porque nossos contratos serão compilados para WebAssembly, não para código nativo da sua máquina.

Agora vamos instalar o Stellar CLI:

```bash
brew install stellar-cli
```

Se vocês não usam macOS, podem instalar via Cargo:

```bash
cargo install --locked stellar-cli@23.0.0
```

Por último, vamos criar nossa conta de desenvolvimento:

```bash
stellar keys generate --global alice --network testnet --fund
```

Este comando cria uma conta chamada "alice" na testnet e automaticamente adiciona tokens de teste. Para ver o endereço da conta:

```bash
stellar keys address alice
```

### 4.1 Criar Projeto

> Agora vamos criar nosso projeto Soroban:

```bash
stellar contract init hello-world
```

Este comando cria toda a estrutura de um projeto Soroban.

MOSTRAR ÁRVORE DE ARQUIVOS: Vejam a estrutura que foi criada:

```
├── hello-world                    # Diretório raiz do projeto
│   ├── Cargo.toml                 # Configurações do workspace Rust
│   ├── README.md                  # Documentação do projeto
│   └── contracts                  # Pasta contendo todos os contratos
│       ├── projeto-1
│       ├── projeto-2
│       └── hello-world            # Diretório do contrato específico
│           ├── Cargo.toml         # Dependências e configurações do contrato
│           ├── Makefile           # Scripts de automação (build, test, deploy)
│           └── src                # Código fonte do contrato
│               ├── lib.rs         # Implementação principal do contrato
│               └── test.rs        # Testes unitários do contrato
```

Esta estrutura permite organizar múltiplos contratos em um único workspace, facilitando projetos complexos.

### 4.2 Escrever Contrato

MOSTRAR CRIAÇÃO DE MÓDULO: Agora vamos implementar nosso Hello World. Abram o arquivo `src/lib.rs`:

```rust
#![no_std]
use soroban_sdk::{contract, contractimpl, vec, Env, String, Vec};

#[contract]
pub struct Contract;

#[contractimpl]
impl Contract {
    pub fn hello(env: Env, to: String) -> Vec<String> {
        vec![&env, String::from_str(&env, "Hello"), to]
    }
}
```

Deixe-me explicar cada parte deste código:

`#![no_std]`: Indica que não usamos a biblioteca padrão do Rust. Isso é necessário em ambientes determinísticos como blockchain.

`#[contract]`: Esta é uma macro DSL (Domain Specific Language) do Soroban que marca nossa struct como um contrato inteligente.

`#[contractimpl]`: Marca a implementação que contém as funções públicas do nosso contrato.

`env: Env`: Este parâmetro é a interface com o runtime Soroban. Através dele temos acesso a storage, eventos, funções criptográficas, e outras funcionalidades da blockchain.

A função `hello` recebe um nome e retorna um vetor com "Hello" seguido do nome fornecido.

### 4.3 Compilar Contrato

> Agora vamos compilar nosso contrato:

```bash
stellar contract build
```

Este comando compila o contrato Rust para WebAssembly. Em seguida, vamos otimizar:

```bash
stellar contract optimize --wasm ./target/wasm32-unknown-unknown/release/hello_world.wasm
```

A otimização reduz o tamanho do arquivo Wasm, economizando custos de storage na blockchain.

### 4.4 Testar Contrato

> Antes do deploy, sempre testem localmente:

```bash
cargo test
```

Os testes garantem que nossa lógica está funcionando corretamente antes de colocar na blockchain.

### 4.5 Upload

> Agora vamos fazer o upload do contrato para a blockchain:

```bash
stellar contract upload --source-account alice --wasm ./target/wasm32v1-none/release/hello_world.wasm
```

Nota: Se vocês estiverem usando Rust < 1.85, usem:

```bash
stellar contract upload --source-account alice --wasm ./target/wasm32-unknown-unknown/release/hello_world.wasm
```

Este comando retorna um hash que representa o bytecode do nosso contrato na rede.

### 4.6 Install

> Agora instalamos uma instância específica do contrato:

```bash
stellar contract deploy --source-account alice --wasm-hash WASM_HASH
```

Substituam WASM_HASH pelo hash que vocês receberam no passo anterior. Este comando retorna o contract ID que usaremos para interagir com o contrato.

### 4.7 Interagir

> Finalmente, vamos interagir com nosso contrato!

Primeiro, uma simulação (não gasta gas):

```bash
stellar contract invoke --id CA2DJTTURO5I6MSIACUBQP7P3RG3GAJBALUAZULKWH7A32SHRIP4I5GT --source alice  -- hello --to Lucas
```

Para realmente executar na blockchain:

```bash
stellar contract invoke --id CA2DJTTURO5I6MSIACUBQP7P3RG3GAJBALUAZULKWH7A32SHRIP4I5GT --send=yes  --source alice  -- hello --to Lucas
```

Parabéns! Vocês acabaram de fazer seu primeiro deploy e interação com um smart contract na Stellar Network!

---

## Revisão

Vamos fazer uma recapitulação de tudo que aprendemos hoje. É importante consolidar esses conceitos antes de partirmos para a próxima aula.

### 1. Conceitos Fundamentais de Blockchain

No primeiro bloco, estabelecemos as bases:

- Aprendemos que wallets gerenciam chaves e facilitam nossa interação com blockchain - elas não guardam moedas, apenas as chaves de acesso
- Vimos que transações têm operações específicas, fees associadas e passam por um ciclo completo de validação
- Entendemos que blocos contêm transações agrupadas e são criados através de consenso entre os nós
- Descobrimos que a Stellar usa SCP, um consenso federado bizantino extremamente eficiente

### 2. Stellar Network: A Blockchain para Pagamentos Globais

No segundo bloco, mergulhamos na Stellar:

- Vimos que a Stellar oferece transações rápidas (3-5 segundos) e extremamente baratas (0.00001 XLM por operação)
- Aprendemos como o SCP permite consenso sem mineração ou staking, usando reputação e confiança
- Conhecemos um ecossistema focado em inclusão financeira global
- Entendemos o papel do XLM como token nativo e bridge currency entre diferentes ativos

### 3. Smartcontracts na Stellar com Soroban

No terceiro bloco, exploramos a tecnologia:

- Descobrimos que Soroban usa WebAssembly como runtime para máxima performance
- Vimos por que Rust oferece segurança e performance ideais para desenvolvimento blockchain
- Conhecemos as ferramentas: Stellar CLI, Soroban SDK e Stellar SDKs
- Aprendemos que contratos usam DSL específica e ambiente no_std para determinismo

### 4. Deploy do Primeiro Hello World

No bloco prático, colocamos a mão na massa:

- Implementamos a estrutura básica usando `#[contract]` e `#[contractimpl]`
- Seguimos o ciclo completo: compilar → testar → upload → install → interagir
- Configuramos o ambiente com as ferramentas necessárias
- Entendemos o uso do `Env` para interagir com o runtime Soroban

---

## Lição de casa

Agora é hora de vocês praticarem e consolidarem o aprendizado!

### Desafio de Aprendizagem

Preparei três níveis de desafio para vocês:

**Nível fácil:** Modifique nosso Hello World para retornar uma mensagem personalizada. Por exemplo, em vez de "Hello Lucas", façam retornar "Bem-vindo ao Soroban, Lucas!".

**Nível médio:** Criem um contrato contador que incrementa um valor interno e retorna o valor atual. Isso vai exigir que vocês aprendam sobre storage no Soroban.

**Nível difícil:** Implementem um contrato de votação simples com múltiplas opções. Os usuários devem poder votar, e o contrato deve retornar os resultados.

### Recursos para Estudar

Separei alguns recursos essenciais para vocês:

- Documentação oficial do Soroban: https://soroban.stellar.org/docs
- Stellar Developers: https://developers.stellar.org/
- Exemplos práticos: https://github.com/stellar/soroban-examples
- The Rust Book: https://doc.rust-lang.org/book/

### Desafio de Carreira

Vamos dar visibilidade ao nosso aprendizado:

- Façam um post no LinkedIn e Twitter com a hashtag #road2meridian e mencionem que estamos na aula 1 de 3 do workshop 2
- Marquem a Stellar (@StellarOrg) para eles verem nosso progresso
- Marquem a NearX (@NearX) para amplificarmos nossa rede

### Desafio de Comunidade

Para fortalecermos nossa comunidade:

- Postem uma foto da mesa de trabalho de vocês no Discord da NearX - quero ver onde a mágica acontece!
- Postem uma mensagem de encorajamento no Discord da Stellar para inspirar outros desenvolvedores

---

## Próxima Aula

Na próxima aula, vamos explorar **Tipos de Dados e Storage em Soroban**. Vocês vão aprender como armazenar dados persistentes na blockchain, trabalhar com diferentes tipos de dados complexos, e criar contratos mais sofisticados que mantêm estado entre execuções.

Até lá, pratiquem bastante e não hesitem em tirar dúvidas na nossa comunidade!

Obrigado pela atenção de todos, foi um prazer imenso começar essa jornada com vocês. Até a próxima aula!
