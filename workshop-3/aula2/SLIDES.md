---
marp: true
theme: gaia
---

# **Workshop: Road to Meridian 3**

## **Dia 2: Composabilidade Raiz!**

Hoje vamos mergulhar no poder da **composabilidade** em smart contracts! 🚀

Vocês estão prestes a descobrir como construir aplicações descentralizadas robustas e seguras, combinando contratos inteligentes como peças de LEGO. Cada padrão que aprenderemos hoje é uma ferramenta poderosa que transformará vocês em arquitetos de soluções blockchain.

**Prepare-se para elevar seu conhecimento ao próximo nível!**

---

### Programa da aula:

0. **Quem somos e o que é o Road to Meridian?**
1. **Cross Contracts**
2. **Autenticação em Profundidade**
3. **Deployer Pattern**
4. **Upgradable Pattern**
5. **Hands-on**

---

## 0. Apresentação

### Lucas Oliveira

- Matemático (formado em 2021).
- +5 anos como Engenheiro Sênior de Blockchain.
- Criação de Layer 1, SDKs, smart contracts (EVM e não-EVM).
- Liderou a entrega de 2 Projetos do DREX.
- Embaixador da Stellar no Brasil.
- Contribuidor F/OSS: +3 bibliotecas crypto publicadas.
- Head of Education @ NearX: Liderança em educação blockchain na LATAM.

---

### NearX

- Plataforma de educação em tecnologias emergentes (Web3, IA, Blockchain).
- Consultoria em Blockchain para Empresas.
- 30 Alunos na Pós-Graduação Lato Sensu.
- +9.000 alunos na Plataforma.
- +2.500 membros no Discord.
- Oferece: Pós-graduação, Plataforma por assinatura, Mentorias, Bootcamps, Hackathons
- Parcerias: Stellar, Animoca Brands, Optimism, Arbitrum, Starknet, ZkVerify, MultiverseX.

---

### Stellar

- +13Bi de capitalização de mercado.
- Fundada em 2014 por Jed McCaleb, fundador da Mt. Gox e cofundador da Ripple.
- Smart contracts em Rust lançados em 2023 por Graydon Hoare.

---

### Road to Meridian

#### Workshop 1: Introdução ao Rust

- Aula 1: Criar e Publicar Bibliotecas em Rust
- Aula 2: Criar e Fazer Deploy de Rest API CRUD em Rust
- Aula 3: Criar e Integrar WebAssembly em Rust

---

### Road to Meridian

#### Workshop 2: Smart contracts básicos na Stellar com Soroban

- Aula 1: Básico de Blockchain e Hello World
- Aula 2: Smart contracts e integração com backend
- Aula 3: Smart contracts e integração com frontend

---

### Road to Meridian

#### Workshop 3: Smart contracts avançados na Stellar com Soroban

- Aula 1: Segurança em Smart Contracts
- Aula 2: Composabilidade em Protocolos Soroban
- Aula 3: Implementando Passkey Authn

---

## 1. Cross Contracts

Cross Contracts é um dos pilares fundamentais da composabilidade no Soroban. Permite que contratos inteligentes interajam entre si de forma segura e eficiente, criando um ecossistema interoperável de aplicações descentralizadas.

### O que é Cross Contracts?

Cross Contracts refere-se à capacidade de um contrato inteligente invocar funções de outros contratos na rede Stellar. Isso permite:

- **Composabilidade**: Construir aplicações complexas combinando contratos menores
- **Reutilização de código**: Aproveitar funcionalidades existentes
- **Modularidade**: Separar responsabilidades em contratos especializados

### Cross-Contract Call

O Soroban oferece suporte nativo para chamadas entre contratos através do `contractimport!` macro e tipos Client:

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

---

## 2. Autenticação em Profundidade

O Soroban implementa um sistema de autenticação robusto e flexível que permite controle granular sobre quem pode executar determinadas operações. Este sistema é fundamental para a segurança dos contratos inteligentes.

### Framework de Autorização Soroban

O Soroban oferece um framework de autorização avançado que inclui:

- **Abstração de Contas**: Suporte para diferentes tipos de contas e assinaturas
- **Biblioteca de Autorização**: Ferramentas integradas para validação de permissões
- **Regras Complexas**: Capacidade de implementar lógicas de autorização sofisticadas

---

### Controle de Acesso em Profundidade

Esse tipo de autenticação visa identificar um usuário mesmo depois de várias chamadas entre contratos.

User -> Contrato-a -> Contrato-b -> Contrato-c

Como podemos validar no Contrato-C se o user assinou essa chamada?

Isso é muito útil, veja esse caso:

---

### Caso Real: Soroswap

No Soroswap, quando um usuário faz uma troca de tokens (swap), a transação passa por múltiplos contratos:

1. Router Contract (entrada)
2. Factory Contract (localiza pool)
3. Pool Contract (executa swap)

O Pool Contract precisa validar se o usuário original autorizou a operação, mesmo após passar por dois contratos intermediários. Isso previne manipulações não autorizadas e garante que apenas trocas legítimas sejam executadas.

Outros casos incluem:

- Sistemas de governança em DAOs
- Protocolos de empréstimo compostos
- Plataformas de NFT com royalties em cascata

---

### Deep Contract Auth

O Soroban oferece autenticação profunda através de `require_auth` e `require_auth_for_args`:

```rust
CODIGO
```

---

### Padrões de Segurança

**1. Principle of Least Privilege**: Conceder apenas as permissões mínimas necessárias
**2. Multi-signature**: Requerer múltiplas assinaturas para operações críticas
**3. Time-based Access**: Implementar janelas temporais para operações sensíveis
**4. Role-based Access Control**: Definir papéis e permissões específicas

---

## 3. Deployer Pattern

O Deployer Pattern é uma estratégia fundamental para otimizar o processo de deploy de múltiplos contratos inteligentes na rede Stellar. Este padrão permite criar contratos de forma programática e eficiente.

### O que é o Deployer Pattern?

O Deployer Pattern, também conhecido como Factory Pattern, permite que um contrato inteligente implante outros contratos dinamicamente. Isso oferece:

- **Eficiência**: Deploy de múltiplos contratos a partir de um único ponto
- **Padronização**: Garantir que todos os contratos sigam as mesmas especificações
- **Controle**: Manter registro e controle sobre contratos criados

---

### Factory Contract Implementation

O Soroban SDK oferece funcionalidades nativas para deploy programático:

```rust
CODIGO
```

---

### Vantagens do Deployer Pattern

**1. Economia de Gas**: Deploy otimizado de múltiplos contratos
**2. Versionamento**: Controle de versões dos contratos deployados
**3. Configuração Centralizada**: Parâmetros padronizados para todos os contratos
**4. Auditoria**: Rastreabilidade completa dos contratos criados

---

## 4. Upgradable Pattern

O Upgradable Pattern permite que contratos inteligentes sejam atualizados após o deploy, mantendo o mesmo endereço e estado. Este padrão é crucial para correção de bugs, melhorias de funcionalidade e evolução de aplicações.

### Estratégias de Upgrade no Soroban

O Soroban oferece diferentes abordagens para implementar contratos atualizáveis:

- **Proxy Pattern**: Separar lógica de dados usando contratos proxy
- **Diamond Pattern**: Modularizar funcionalidades em múltiplos contratos
- **Versioning Pattern**: Manter múltiplas versões com migração controlada

---

### Implementação do Proxy Pattern

O padrão mais comum utiliza um contrato proxy que delega chamadas para contratos de implementação:

```rust
CODIGO
```

---

### Boas Práticas para Upgrades

**1. Governança**: Implementar mecanismos de governança para aprovação de upgrades
**2. Timelock**: Adicionar delays para upgrades críticos
**3. Migração de Estado**: Planejar estratégias para migração de dados
**4. Testes Rigorosos**: Validar upgrades em ambientes de teste
**5. Rollback**: Manter capacidade de reverter upgrades problemáticos

---

## 5. Hands-on

Para condensar tudo o que aprendemos, vamos criar um projeto simples para fixar o conhecimento.

- Cross Contract
- Autenticaçao em profundidade
- Deployer Pattern
- Upgradable Pattern

---

### Como?

Nosso projeto será uma plataforma de Gestão de tarefas em que:

- É possivel comprar um app de gestão de tarefas individual
- Apenas o Admin pode sacar o valor da plataforma de venda de apps
- Apenas o dono do app pode adicionar tarefas
- Deve ser possivel atualizar o app
- Apenas o dono do app pode atualizar ele
- Na v2 deve ser possivel adicionar tarefas em outros apps desde que seu dono assine
- Na v2 deve ser possivel ver tarefas de outros apps

---

## Revisão

1. **Cross Contracts**

- [x] Composabilidade permite construir aplicações complexas combinando contratos menores
- [x] Cross-contract invocation através de `env.invoke_contract()` para chamadas entre contratos
- [x] Padrões de interoperabilidade: Interface Contracts, Proxy Patterns e Registry Patterns
- [x] Modularidade e reutilização de código como benefícios principais

2. **Autenticação em Profundidade**

- [x] Framework de autorização Soroban com abstração de contas e regras complexas
- [x] `require_auth()` como mecanismo principal para validação de autenticação
- [x] Suporte para multi-signature e autenticação de múltiplos usuários
- [x] Padrões de segurança: Least Privilege, Time-based Access, Role-based Access Control

3. **Deployer Pattern**

- [x] Factory Pattern permite deploy programático de múltiplos contratos
- [x] `env.deployer()` para criação dinâmica de contratos com salt e wasm_hash
- [x] Vantagens: economia de gas, versionamento, configuração centralizada
- [x] Controle e auditoria completa dos contratos deployados

4. **Upgradable Pattern**

- [x] Proxy Pattern para separar lógica de dados em contratos atualizáveis
- [x] Estratégias: Proxy, Diamond e Versioning Patterns
- [x] Boas práticas: governança, timelock, migração de estado, testes rigorosos
- [x] Capacidade de rollback para reverter upgrades problemáticos

5. **Hands-on**

- [x] Exercícios práticos implementando cross-contract communication
- [x] Sistema de autenticação multi-nível com roles e permissões
- [x] Factory contract para deploy automatizado de tokens

---

## Lição de Casa

### Desafio de Aprendizagem

- **Fácil**: Implemente um contrato que use `require_auth()` para proteger uma função de transferência de tokens. Teste com diferentes usuários.

- **Médio**: Crie um sistema de factory contract que possa deployar contratos de votação com diferentes configurações (duração, opções, quorum mínimo).

- **Difícil**: Desenvolva um contrato upgradeable usando proxy pattern que mantenha estado durante upgrades. Implemente governança com timelock para aprovação de upgrades.

**Recursos:**

### Documentação Oficial

- [Soroban Documentation](https://soroban.stellar.org/) - Documentação completa do Soroban
- [Stellar Developer Portal](https://developers.stellar.org/) - Portal de desenvolvedores Stellar
- [Soroban SDK Rust Docs](https://docs.rs/soroban-sdk/) - Documentação da SDK Rust

### Exemplos e Tutoriais

- [Soroban Examples](https://github.com/stellar/soroban-examples) - Exemplos oficiais de contratos
- [Soroban How-To Guides](https://soroban.stellar.org/docs/how-to-guides) - Guias práticos
- [Stellar DApp Examples](https://github.com/stellar/stellar-dapp-examples) - Exemplos de DApps

### Ferramentas de Desenvolvimento

- [Stellar CLI](https://github.com/stellar/stellar-cli) - Ferramenta de linha de comando
- [Soroban RPC](https://soroban.stellar.org/docs/reference/rpc) - Referência da API RPC
- [Stellar Build](https://stellar.build/) - Plataforma de desenvolvimento

### Desafio de Carreira

- Post no LinkedIn e Twitter sobre padrões de segurança em smart contracts com #road2meridian #SorobanSecurity
- Marque a @StellarOrg e destaque um padrão que mais te impressionou
- Marque a @NearX_Official e compartilhe seu progresso no workshop

### Desafio de Comunidade

- Compartilhe seu código do exercício hands-on no Discord da NearX com explicação
- Ajude um colega com dúvidas sobre autenticação ou cross contracts no Discord da Stellar
- Poste uma dica de segurança que aprendeu hoje nos grupos de estudo

---

## Próxima Aula

Na próxima aula, vamos explorar **O Frontend do Futuro com Passkey**. Até lá!
