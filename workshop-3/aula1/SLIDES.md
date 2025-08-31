---
marp: true
theme: gaia
---

# **Workshop: Road to Meridian 3**

## **Dia 1: Segurança em Smart Contracts**

---

Bem-vindos ao **Workshop: Road to Meridian 3**! Hoje vamos mergulhar profundamente na segurança de smart contracts na Stellar Network. Esta aula vai abordar conceitos avançados como TTL (Time to Live), autenticação, multiassinatura e testes de segurança com fuzzing.

---

### Programa da aula:

0. **Quem somos e o que é o Road to Meridian?**
1. **Time to Live (TTL)**
2. **Autenticação em Smart Contracts**
3. **Boas Práticas de Segurança**
4. **Hands-on**

---

## 0. Apresentação

### Lucas Oliveira

- Matemático (formado em 2021).
- +5 anos como Engenheiro Senior de Blockchain.
- Criação de Layer 1, SDKs, smart contracts (EVM e não-EVM).
- Liderou a entrega de 2 Projetos do DREX.
- Embaixador da Stellar no Brasil.
- Contribuidor F/OSS: +3 bibliotecas crypto publicadas.
- Head of Education @ NearX: Liderança em educação blockchain na LATAM.

---

### NearX

- Plataforma de educação em tecnologias emergentes (Web3, IA, Blockchain).
- Consultoria em Blockchain para Empresas.
- 30 Alunos na Pós Graduação Lato Senso.
- +9.000 alunos na Plataforma.
- +2.500 membros no Discord.
- Oferece: Pós-graduação, Plataforma por assinatura, Mentorias, Bootcamps, Hackathons
- Parcerias: Stellar, Animoca Brands, Optimism, Arbitrum, Starknet, ZkVerify, MultiverseX.

---

### Stellar

- +13Bi de captalização de mercado.
- Fundada em 2014 por Jed McCaleb, fundador da Mt. Gox e cofundador da Ripple.
- Smart contracts em Rust lançados em 2023 por Graydon Hoare.

---

### Road to Meridian

#### Workshop 1: Introdução ao Rust

- Aula 1: Criar e Publicar Bibliotecas em Rust
- Aula 2: Criar e Deployar Rest API CRUD em Rust
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

## 1. Time to Live (TTL)

O TTL é um mecanismo que controla o tempo de vida dos smart contracts. Vamos explorar os três tipos de storage e como o TTL afeta cada um.

Diferente do mundo EVM, aqui os contratos não vivem para sempre. Além disso, o tempo de vida do contrato nem sempre é o mesmo que o tempo de vida dos dados do contrato.

---

### Por que?

O arquivamento de estado (via TTL) impede que o ledger cresça indefinidamente. Isso permite:

- Manter o tamanho do ledger ativo gerenciável
- Reduzir os requisitos de armazenamento dos nós
- Incentivar o uso eficiente dos dados
- Permitir armazenamento de longo prazo mais barato

Vamos ver como isso funciona.

---

### Como funciona

| Estado   | TTL     | Descrição                                     |
| -------- | ------- | --------------------------------------------- |
| Ativo    | TTL > 0 | Dados estão ativos e acessíveis na blockchain |
| Expirado | TTL = 0 | Dados expiram e se tornam inativos            |

- O TTL é baseado nos ledgers (blocos).
- Decrementa -1 a cada novo ledger (aprox. a cada 5 segundos na Stellar).

---

### Tipos

- **Instance, Persistent, Temporary**
- **Persistent & Instance Storage:** Quando o TTL expira, os dados são movidos para um armazenamento "frio" fora da blockchain. Você pode restaurá-los depois pagando uma taxa.
- **Temporary:** Quando o TTL expira, os dados são permanentemente excluídos do ledger.

---

### Extensão

É possível estender o TTL usando o método `extend_ttl()` no seu contrato.

- Pague uma taxa baseada na duração da extensão
- Você pode estender quantas vezes quiser
- Cada tipo de storage (Persistent, Instance, Temporary) pode ter seu TTL estendido de forma independente

---

### 2. Autorização e Autenticação

Precisamos apenas entender que:

- Primeiro autenticamos e depois autorizamos
- É possível autenticar múltiplos usuários na mesma chamada
- É possível personalizar a autenticação nativa usando `__check_auth`
- Uma falha de autenticação fará com que a transação falhe como um todo
- Não é possível obter o endereço do usuário nativamente; ele precisa ser passado como parâmetro: `user.require_auth();`

---

## 3. Boas Práticas de Segurança

IMAGEM SOBRE SEGURANçA

---

### <div align="center">#1. Threat Modeling</div>

- Desde o início (STRIDE), com diagramas de fluxo de dados e revisão contínua a cada mudança de design. [Documentação oficial Stellar](https://developers.stellar.org/docs/build/security-docs/threat-modeling/threat-modeling-how-to)

---

### <div align="center">#2. STRIDE Template</div>

- Utilize o template STRIDE para documentar ativos, ameaças, impactos e mitigação; registre riscos aceitos quando aplicável. [STRIDE Template](https://developers.stellar.org/docs/build/security-docs/threat-modeling/STRIDE-template)

---

### <div align="center">#3. Autenticação Segura</div>

- Use soluções de autenticação prontas e bem testadas; evite reinventar login; habilite MFA sempre que possível. [Boas Práticas de Autenticação](https://developers.stellar.org/docs/build/security-docs/securing-web-based-projects)

---

### <div align="center">#4. Camada HTTP Segura</div>

- Fortaleça a camada HTTP com cabeçalhos de segurança e valide com ferramentas como Mozilla Observatory. [Segurança Web](https://developers.stellar.org/docs/build/security-docs/securing-web-based-projects)

---

### <div align="center">#5. Proteção contra CSRF e SQL Injection</div>

- Proteja contra CSRF e injeção de SQL; ative proteção CSRF e prefira ORM a consultas SQL construídas a partir de entrada do usuário. [Segurança Web](https://developers.stellar.org/docs/build/security-docs/securing-web-based-projects)

---

### <div align="center">#6. Políticas Públicas e Educação</div>

- Estabeleça políticas públicas e educação de usuários para reduzir phishing e engenharia social. [Segurança Web](https://developers.stellar.org/docs/build/security-docs/securing-web-based-projects)

---

### <div align="center">#7. Documentação de Fluxo de Dados</div>

- Documente o fluxo de dados, fronteiras de confiança e áreas de controle; use isso como base para o threat modeling. [Como Documentar](https://developers.stellar.org/docs/build/security-docs/threat-modeling/threat-modeling-how-to)

---

### <div align="center">#8. Exemplos Práticos para Treinamento</div>

- Use exemplos práticos para treinar o time em STRIDE e identificação de ameaças (ex.: Pizza Restaurant example). [Exemplo Prático](https://developers.stellar.org/docs/build/security-docs/threat-modeling/pizza-restaurant-example)

---

### <div align="center">#9. Matriz de Mitigação</div>

- Construa uma matriz de mitigação (ameaça -> contramedida) e mantenha-a atualizada ao longo do ciclo de vida. [STRIDE Template](https://developers.stellar.org/docs/build/security-docs/threat-modeling/STRIDE-template) | [Como Fazer](https://developers.stellar.org/docs/build/security-docs/threat-modeling/threat-modeling-how-to)

---

### <div align="center">#10. Melhoria Contínua</div>

- Adote a mentalidade de melhoria contínua: segurança e atacantes evoluem; revise periodicamente controles, dependências e configurações. [Segurança Web](https://developers.stellar.org/docs/build/security-docs/securing-web-based-projects) | [Como Fazer](https://developers.stellar.org/docs/build/security-docs/threat-modeling/threat-modeling-how-to)

---

## 4. Hands On

Para condensar tudo que aprendemos vamos criar um projeto simples para fixar o conhecimento.

- TTL: Instance, Persistent e Temporary
- Autenticação simples e múltipla
- Boas práticas de segurança

---

### Como?

Nosso projeto será um simulador de estacionamento onde:

- Qualquer usuário pode estacionar seu carro
- Apenas o admin pode alterar os preços do estacionamento
- Apenas dois admins podem sacar o valor do estacionamento
- O ticket é cobrado por hora
- É possível comprar um passe anual
- O usuário precisa tirar o carro antes do ticket expirar ou será multado
- A multa custa o passe anual

---

## Revisão

- TTL: definição, tipos de storage (Instance, Persistent, Temporary) e como a extensão de TTL afeta cada um.
- Autorização e autenticação: ordem correta (autenticar depois autorizar), múltiplos usuários e possibilidade de personalizar a checagem.
- Boas práticas: threat modeling (STRIDE), camadas de defesa na web (HTTP seguro, CSRF/ORM), políticas contra phishing e melhoria contínua.
- Hands-on: simulador de estacionamento abordando TTL, autenticação e práticas de segurança.

---

## Lição de casa

### Desafio de Aprendizagem

- Fácil: Liste quais dados do seu contrato poderiam usar Temporary vs Persistent e justifique o TTL de cada um.
- Médio: Desenhe um diagrama de fluxo de dados (DFD) do seu projeto e aplique STRIDE a pelo menos 2 ameaças, propondo mitigação.
- Difícil: Crie um checklist de segurança para seu repositório (autenticação, cabeçalhos HTTP, CSRF, políticas anti-phishing) e aplique-o em uma branch de hardening.

### Desafio de Carreira

- Publique no LinkedIn/Twitter um resumo do que aprendeu sobre segurança em smart contracts e threat modeling; inclua um DFD simples do seu projeto e marque a comunidade.

### Desafio de Comunidade

- Compartilhe seu DFD e matriz de mitigação no Discord da turma; dê feedback construtivo em pelo menos 2 colegas.

---

## Próxima Aula

Na próxima aula, vamos explorar **Composabilidade em Protocolos Soroban**. Até lá!
