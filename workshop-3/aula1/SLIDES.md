---
marp: true
theme: gaia
---

# **Workshop: Road to Meridian 3**

## **Dia 1: Segurança em Smart Contracts**

---

Bem-vindos ao **Workshop: Road to Meridian 3**! Hoje vamos mergulhar profundamente na segurança de smart contracts na Stellar Network. Esta aula abordará conceitos avançados como TTL (Time to Live), autenticação, multiassinatura e testes de segurança com fuzzing.

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

## 1. Time to Live (TTL)

O TTL é um mecanismo que controla o tempo de vida dos smart contracts. Vamos explorar os três tipos de storage e como o TTL afeta cada um.

Diferentemente do mundo EVM, aqui os contratos não vivem para sempre. Além disso, o tempo de vida do contrato nem sempre é o mesmo que o tempo de vida dos dados do contrato.

---

### Por quê?

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
- Decrementa -1 a cada novo ledger (aproximadamente a cada 5 segundos na Stellar).

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

## 3. Boas Práticas de Segurança e Modelagem de Ameaças

---

### <div align="center">THREAT MODELING</div>

- O que estamos fazendo?
- O que pode dar errado?
- O que vamos fazer sobre isso?
- Fizemos um bom trabalho?

---

### <div align="center">O que estamos fazendo?</div>

**Entidades Externas**

- Sistemas ou atores fora do controle da aplicação/empresa
- Exemplos: usuários, APIs externas, serviços de terceiros

**Processos**

- Código e sistemas sob controle da aplicação/empresa
- Exemplos: serviços de backend, smart contracts, lógica de negócio

**Fluxos de Dados**

- Movimento de dados entre sistemas
- Exemplos: chamadas de API, interações com contratos, consultas ao banco de dados

**Armazenamento de Dados**

- Onde os dados persistem no sistema
- Exemplos: armazenamento de contratos Soroban, bancos de dados, servidores de arquivos

**Fronteiras de Confiança**

- Áreas onde as premissas de confiança mudam entre sistemas
- Exemplo: Fronteira frontend/backend onde a validação de entrada deve ocorrer
- Crítico para identificar pontos de controle de segurança

---

### <div align="center">O que pode dar errado? {STRIDE}</div>

**Falsificação**

- Definição: Um atacante pode se passar por outra pessoa, frequentemente aproveitando falhas na verificação do usuário final em sistemas downstream.
- Pergunta a Fazer: O atacante poderia induzir uma ação se passando por outra pessoa?

**Adulteração**

- Definição: Um atacante pode modificar dados enviados para ter um efeito diferente do previsto.
- Pergunta a Fazer: A requisição poderia ser modificada de alguma forma para executar uma ação diferente da pretendida?

**Repúdio**

- Definição: Um usuário pode alegar que não realizou a ação que foi tomada.
- Pergunta a Fazer: O usuário pode "refutar" a ação, alegando que não a realizou?

**Divulgação de Informação**

- Definição: Compartilhamento excessivo de dados que deveriam ser mantidos privados.
- Pergunta a Fazer: Existem áreas onde mais informações estão sendo compartilhadas ou informações limitadas estão sendo compartilhadas com mais pessoas do que o estritamente necessário?

**Negação de Serviço**

- Definição: Um atacante pode afetar negativamente a disponibilidade de um sistema.
- Pergunta a Fazer: Existe alguma parte da aplicação que pode ser sobrecarregada ou tornada totalmente indisponível devido à demanda excessiva?

**Elevação de Privilégio**

- Definição: Refere-se à capacidade de um atacante obter privilégios e funções adicionais além do que inicialmente foi concedido, seja por meios legítimos ou ilegítimos.
- Pergunta a Fazer: Alguém pode ganhar privilégios adicionais sem autenticação e autorização adequadas?

---

### <div align="center">O que vamos fazer sobre isso?</div>

#### Medidas de Mitigação

- Padrões de Segurança
- Testes TDD e BDD
- Testes fuzzy
- Código auditado pela comunidade
- Análise estática de código
- Auditorias

#### Matriz de Risco

A matriz de risco nos ajuda a priorizar ameaças baseadas em:

**Probabilidade/Impacto**

IMAGEM DE MATRIZ DE RISCO: https://www.espm.br/wp-content/uploads/Matriz-de-risco.png

- Alto: Ação imediata necessária
- Médio: Planejar mitigação
- Baixo: Monitorar

---

### <div align="center">Fizemos um bom trabalho?</div>

- O diagrama de fluxo de dados foi referenciado desde sua criação?
- O modelo STRIDE revelou novos problemas ou preocupações de design que não haviam sido previamente abordados ou considerados?
- Os tratamentos identificados na seção "O que vamos fazer sobre isso" abordaram adequadamente os problemas identificados?
- Foram encontrados problemas adicionais após o modelo de ameaças?

---

## 4. Hands-on

Para condensar tudo o que aprendemos, vamos criar um projeto simples para fixar o conhecimento.

- TTL: Instance, Persistent e Temporary
- Autenticação simples e múltipla 
- Boas práticas de segurança

---

### Como?

Nosso projeto será um simulador de estacionamento em que:

- Qualquer usuário pode estacionar seu carro
- Apenas o administrador pode alterar os preços do estacionamento
- Apenas dois administradores podem sacar o valor do estacionamento
- O tíquete é cobrado por hora
- É possível comprar um passe anual
- O usuário precisa retirar o carro antes de o tíquete expirar ou será multado
- A multa custa o valor do passe anual

---

## Revisão

- TTL: definição, tipos de storage (Instance, Persistent, Temporary) e como a extensão de TTL afeta cada um
- Autorização e autenticação: ordem correta (autenticar e depois autorizar), múltiplos usuários e possibilidade de personalizar a verificação
- Boas práticas: threat modeling (STRIDE), camadas de defesa na web (HTTP seguro, CSRF/ORM), políticas contra phishing e melhoria contínua
- Hands-on: simulador de estacionamento abordando TTL, autenticação e práticas de segurança

---

## Lição de Casa

### Desafio de Aprendizagem

- Fácil: Liste quais dados do seu contrato poderiam usar Temporary versus Persistent e justifique o TTL de cada um
- Médio: Desenhe um diagrama de fluxo de dados (DFD) do seu projeto e aplique STRIDE a pelo menos duas ameaças, propondo mitigação
- Difícil: Aplique testes fuzzy no seu contrato

### Desafio de Carreira

- Publique no LinkedIn/Twitter um resumo do que aprendeu sobre segurança em smart contracts e threat modeling; inclua um DFD simples do seu projeto e marque a comunidade

### Desafio de Comunidade

- Compartilhe seu DFD e matriz de mitigação no Discord da turma; dê feedback construtivo em pelo menos dois colegas

---

## Próxima Aula

Na próxima aula, vamos explorar **Composabilidade em Protocolos Soroban**. Até lá!
