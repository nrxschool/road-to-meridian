# Roteiro Final: Workshop: Road to Meridian 3 – Dia 1: Segurança em Smart Contracts

## Introdução: Bem-vindos ao Workshop: Road to Meridian 3 🚀

Olá! Seja muito bem-vindo ao **Workshop: Road to Meridian 3**!

Hoje é um dia especial porque vamos mergulhar profundamente na segurança de smart contracts na Stellar Network. Se você chegou até aqui, significa que já domina os fundamentos do Rust e já sabe criar smart contracts básicos. Agora é hora de elevar seu nível e pensar como um engenheiro de segurança blockchain.

Esta aula vai abordar conceitos avançados que fazem a diferença entre um desenvolvedor iniciante e um profissional que pode trabalhar com protocolos que movimentam milhões de dólares. Vamos falar sobre TTL (Time to Live), autenticação robusta, multiassinatura e testes de segurança com fuzzing.

A jornada até aqui foi desafiadora, mas você está provando que tem a determinação necessária para chegar do outro lado. Os conceitos que vamos ver hoje são usados pelos melhores engenheiros de blockchain do mundo, e ao final desta aula, você também vai dominá-los.

### Programa da nossa aula de hoje:

0. **Quem somos e o que é o Road to Meridian?**
1. **Time to Live (TTL)**
2. **Autenticação em Smart Contracts**
3. **Boas Práticas de Segurança**
4. **Hands-on**

Vamos começar!

---

## Capítulo 0: Apresentação

### Quem sou eu?

Meu nome é **Lucas Oliveira**, e eu vou ser seu guia nesta jornada avançada de segurança em blockchain.

Sou matemático, formado em 2021, e tenho mais de 5 anos como Engenheiro Sênior de Blockchain. Durante esses anos, participei da criação de Layer 1, SDKs e smart contracts tanto no mundo EVM quanto em outras arquiteturas.

Uma das experiências mais marcantes da minha carreira foi liderar a entrega de 2 projetos do DREX - o real digital brasileiro. Isso me deu uma perspectiva única sobre como a segurança é crítica quando você está lidando com infraestrutura financeira nacional.

Sou Embaixador Oficial da Stellar no Brasil e contribuidor de código aberto, com mais de 3 bibliotecas de criptografia publicadas. Atualmente, sou Head of Education na NearX, onde lidero a educação em blockchain na América Latina.

Mas o mais importante é que eu entendo exatamente onde você está nesta jornada, porque eu já passei por todos esses desafios.

### O que é a NearX?

A NearX é muito mais que uma plataforma de educação. Somos uma plataforma especializada em tecnologias emergentes - Web3, IA e Blockchain.

Trabalhamos com consultoria em Blockchain para empresas, temos 30 alunos na nossa Pós-Graduação Lato Sensu, mais de 9.000 alunos na nossa plataforma e uma comunidade vibrante de mais de 2.500 membros no Discord.

Oferecemos desde pós-graduação até mentorias individuais, bootcamps e hackathons. E temos parcerias estratégicas com gigantes como Stellar, Animoca Brands, Optimism, Arbitrum, Starknet, ZkVerify e MultiverseX.

Isso significa que o conhecimento que você está adquirindo aqui está alinhado com as necessidades reais do mercado.

### Por que a Stellar?

A Stellar tem mais de 13 bilhões de dólares de capitalização de mercado. Foi fundada em 2014 por Jed McCaleb - sim, o mesmo fundador da Mt. Gox e cofundador da Ripple.

Mas o que torna a Stellar especial para nós desenvolvedores é que os smart contracts em Rust foram lançados em 2023 por Graydon Hoare - o criador da linguagem Rust. Isso significa que estamos trabalhando com tecnologia de ponta, criada pelos melhores engenheiros do mundo.

### O Road to Meridian - Sua Jornada Completa

O Road to Meridian é uma jornada estruturada em três workshops, cada um construindo sobre o anterior:

**Workshop 1: Introdução ao Rust**

- Aula 1: Criar e Publicar Bibliotecas em Rust
- Aula 2: Criar e Fazer Deploy de Rest API CRUD em Rust
- Aula 3: Criar e Integrar WebAssembly em Rust

**Workshop 2: Smart contracts básicos na Stellar com Soroban**

- Aula 1: Básico de Blockchain e Hello World
- Aula 2: Smart contracts e integração com backend
- Aula 3: Smart contracts e integração com frontend

**Workshop 3: Smart contracts avançados na Stellar com Soroban** (onde estamos agora!)

- Aula 1: Segurança em Smart Contracts (hoje)
- Aula 2: Composabilidade em Protocolos Soroban
- Aula 3: Implementando Passkey Authn

Você está no nível mais avançado desta jornada. Parabéns por ter chegado até aqui!

---

## Capítulo 1: Time to Live (TTL) - O Gerenciamento Inteligente do Ciclo de Vida

Agora vamos entrar no primeiro conceito técnico avançado: o **Time to Live**, ou TTL.

O TTL é um mecanismo que controla o tempo de vida dos smart contracts e seus dados. Vamos explorar os três tipos de storage e como o TTL afeta cada um deles.

Aqui está algo fundamental que diferencia a Stellar do mundo EVM: **os contratos não vivem para sempre**. E mais importante ainda: o tempo de vida do contrato nem sempre é o mesmo que o tempo de vida dos dados do contrato.

Isso pode parecer uma limitação à primeira vista, mas na verdade é uma funcionalidade poderosa que traz benefícios econômicos e de performance.

### Por que o TTL existe?

O arquivamento de estado via TTL impede que o ledger cresça indefinidamente. Imagine se todos os dados que você já salvou no seu computador nunca pudessem ser deletados - eventualmente, você ficaria sem espaço, certo?

O TTL permite:

- **Manter o tamanho do ledger ativo gerenciável** - isso significa que os nós podem processar transações mais rapidamente
- **Reduzir os requisitos de armazenamento dos nós** - tornando mais barato e fácil rodar um nó da rede
- **Incentivar o uso eficiente dos dados** - você paga menos por dados temporários
- **Permitir armazenamento de longo prazo mais barato** - dados importantes podem ser arquivados e restaurados quando necessário

Vamos ver como isso funciona na prática.

### Como o TTL funciona?

O TTL (Time to Live) funciona da seguinte forma:

1. Estados possíveis:

- Quando TTL é maior que 0: Os dados estão ATIVOS e podem ser acessados normalmente na blockchain
- Quando TTL chega a 0: Os dados EXPIRAM e se tornam inativos

2. Funcionamento:

- O TTL é contado em ledgers (blocos) da Stellar
- A cada novo ledger (aproximadamente 5 segundos), é subtraido -1 do TTL
- Exemplo: Se você definir TTL = 1000 (Tempo total ≈ 5000 segundos ou seja, aproximadamente 1 hora e 23 minutos de vida útil)

### Os três tipos de storage

Existem três tipos de storage na Stellar: **Instance, Persistent e Temporary**.

**Persistent & Instance:** Quando o TTL expira, os dados não são perdidos para sempre. Eles são movidos para um armazenamento "frio" fora da blockchain ativa. Você pode restaurá-los depois pagando uma taxa. É como colocar arquivos antigos em um HD externo - eles não estão imediatamente acessíveis, mas você pode recuperá-los quando precisar.

**Temporary:** Quando o TTL expira, os dados são permanentemente excluídos do ledger. É como deletar um arquivo - uma vez que o TTL acaba, não há como recuperar. Use este tipo para dados que você realmente não precisa manter a longo prazo.

### Extensão de TTL

Uma funcionalidade poderosa é que você pode estender o TTL usando o método `extend_ttl()` no seu contrato.

Você pode:

- Pagar uma taxa baseada na duração da extensão
- Estender quantas vezes quiser
- Cada tipo de storage (Persistent, Instance, Temporary) pode ter seu TTL estendido de forma independente

Isso dá a você controle total sobre o ciclo de vida dos seus dados, permitindo otimizações econômicas sofisticadas.

---

## Capítulo 2: Autorização e Autenticação - Controlando Quem Pode Fazer O Quê

Agora vamos falar sobre um dos aspectos mais críticos de qualquer sistema seguro: **autorização e autenticação**.

Em blockchain, isso funciona de forma diferente dos sistemas web tradicionais. Não temos senhas, cookies ou sessões. Em vez disso, temos **assinaturas criptográficas** que provam matematicamente que uma transação veio de quem diz que veio.

Existem alguns princípios fundamentais que você precisa entender:

**Primeiro autenticamos, depois autorizamos.** Esta é a ordem correta e nunca deve ser invertida. Primeiro verificamos quem você é (autenticação), depois verificamos se você tem permissão para fazer o que está tentando fazer (autorização).

**É possível autenticar múltiplos usuários na mesma chamada.** Isso é poderoso para operações que requerem consenso de múltiplas partes, como transferências de grandes valores ou mudanças críticas de configuração.

**É possível personalizar a autenticação nativa usando `__check_auth`.** Isso permite implementar lógicas de autenticação customizadas, como multisig com regras específicas ou autenticação baseada em tempo.

**Uma falha de autenticação fará com que a transação falhe como um todo.** Isso é uma característica de segurança - não há "falhas parciais" que possam deixar o sistema em um estado inconsistente.

**Não é possível obter o endereço do usuário nativamente.** O endereço precisa ser passado como parâmetro e então você chama `user.require_auth()` para verificar se aquele usuário realmente assinou a transação.

Este último ponto é crucial para entender. Você sempre vai escrever código mais ou menos assim:

```rust
pub fn minha_funcao(env: Env, user: Address, valor: u32) {
    user.require_auth(); // Verifica se 'user' realmente assinou esta transação
    // ... resto da lógica
}
```

---

## Capítulo 3: Boas Práticas de Segurança e Modelagem de Ameaças

Agora chegamos ao coração da segurança em smart contracts: **Threat Modeling** - a modelagem de ameaças.

Threat Modeling é uma metodologia sistemática para identificar, quantificar e abordar ameaças de segurança. É o que separa desenvolvedores amadores de engenheiros profissionais.

O processo segue quatro perguntas fundamentais:

1. **O que estamos fazendo?**
2. **O que pode dar errado?**
3. **O que vamos fazer sobre isso?**
4. **Fizemos um bom trabalho?**

Vamos explorar cada uma delas.

### O que estamos fazendo?

Para fazer threat modeling efetivo, precisamos mapear nosso sistema em componentes:

**Entidades Externas** - Sistemas ou atores fora do controle da aplicação ou empresa. Exemplos: usuários finais, APIs externas, serviços de terceiros, oráculos de preço.

**Processos** - Código e sistemas sob controle da aplicação ou empresa. Exemplos: serviços de backend, smart contracts, lógica de negócio, APIs internas.

**Fluxos de Dados** - Movimento de dados entre sistemas. Exemplos: chamadas de API, interações com contratos, consultas ao banco de dados, comunicação entre microserviços.

**Armazenamento de Dados** - Onde os dados persistem no sistema. Exemplos: armazenamento de contratos Soroban (Instance, Persistent, Temporary), bancos de dados, servidores de arquivos.

**Fronteiras de Confiança** - Áreas onde as premissas de confiança mudam entre sistemas. Exemplo crítico: a fronteira frontend/backend, onde a validação de entrada deve sempre ocorrer no backend, nunca confiando apenas na validação do frontend.

### O que pode dar errado? - O modelo STRIDE

Para identificar ameaças sistematicamente, usamos o modelo **STRIDE**:

**S - Spoofing (Falsificação):** Um atacante pode se passar por outra pessoa, frequentemente aproveitando falhas na verificação do usuário final em sistemas downstream. Pergunta-chave: "O atacante poderia induzir uma ação se passando por outra pessoa?"

**T - Tampering (Adulteração):** Um atacante pode modificar dados enviados para ter um efeito diferente do previsto. Pergunta-chave: "A requisição poderia ser modificada de alguma forma para executar uma ação diferente da pretendida?"

**R - Repudiation (Repúdio):** Um usuário pode alegar que não realizou a ação que foi tomada. Pergunta-chave: "O usuário pode 'refutar' a ação, alegando que não a realizou?"

**I - Information Disclosure (Divulgação de Informação):** Compartilhamento excessivo de dados que deveriam ser mantidos privados. Pergunta-chave: "Existem áreas onde mais informações estão sendo compartilhadas do que o estritamente necessário?"

**D - Denial of Service (Negação de Serviço):** Um atacante pode afetar negativamente a disponibilidade de um sistema. Pergunta-chave: "Existe alguma parte da aplicação que pode ser sobrecarregada ou tornada totalmente indisponível?"

**E - Elevation of Privilege (Elevação de Privilégio):** Um atacante pode obter privilégios adicionais além do que inicialmente foi concedido. Pergunta-chave: "Alguém pode ganhar privilégios adicionais sem autenticação e autorização adequadas?"

### O que vamos fazer sobre isso?

Uma vez identificadas as ameaças, precisamos implementar **medidas de mitigação**:

- **Padrões de Segurança** - Seguir best practices estabelecidas pela comunidade
- **Testes TDD e BDD** - Desenvolvimento orientado por testes para garantir comportamento correto
- **Testes fuzzy** - Bombardear o código com inputs aleatórios para encontrar edge cases
- **Código auditado pela comunidade** - Revisão por pares e auditorias públicas
- **Análise estática de código** - Ferramentas automatizadas para detectar vulnerabilidades
- **Auditorias profissionais** - Revisão por especialistas em segurança

#### Matriz de Risco

A matriz de risco nos ajuda a priorizar ameaças baseadas em **Probabilidade versus Impacto**:

- **Alto Risco:** Ação imediata necessária - pare tudo e resolva isso primeiro
- **Médio Risco:** Planejar mitigação - inclua no próximo sprint ou release
- **Baixo Risco:** Monitorar - mantenha no radar mas não é prioridade

Esta priorização é crucial porque recursos são limitados e você precisa focar no que realmente importa.

### Fizemos um bom trabalho?

Finalmente, precisamos validar nosso trabalho:

- O diagrama de fluxo de dados foi referenciado desde sua criação?
- O modelo STRIDE revelou novos problemas que não haviam sido previamente considerados?
- Os tratamentos identificados abordaram adequadamente os problemas identificados?
- Foram encontrados problemas adicionais após o modelo de ameaças?

Esta é uma metodologia iterativa - você vai refinar e melhorar continuamente.

---

## Capítulo 4: Hands-on - Aplicando Tudo na Prática

Agora chegou a hora de colocar a mão na massa! Para condensar tudo o que aprendemos, vamos criar um projeto prático que demonstra:

- **TTL:** Instance, Persistent e Temporary storage
- **Autenticação simples e múltipla**
- **Boas práticas de segurança**

### O Projeto: Simulador de Estacionamento

Vamos criar um simulador de estacionamento inteligente com as seguintes regras de negócio:

- **Qualquer usuário pode estacionar seu carro** - funcionalidade pública básica
- **Apenas o administrador pode alterar os preços do estacionamento** - controle de acesso simples
- **Apenas dois administradores podem sacar o valor do estacionamento** - multisig para operações críticas
- **O tíquete é cobrado por hora** - lógica de negócio com tempo
- **É possível comprar um passe anual** - diferentes tipos de usuário
- **O usuário precisa retirar o carro antes de o tíquete expirar ou será multado** - uso do TTL
- **A multa custa o valor do passe anual** - incentivo econômico para uso correto

Este projeto vai nos permitir explorar todos os conceitos que vimos hoje de forma prática e realista.

---



---

## Revisão: O Que Conquistamos Hoje

Vamos recapitular os conceitos poderosos que você dominou hoje:

**TTL (Time to Live):** Você entendeu a definição, os três tipos de storage (Instance, Persistent, Temporary) e como a extensão de TTL afeta cada um. Agora você pode otimizar custos e performance dos seus contratos.

**Autorização e Autenticação:** Você aprendeu a ordem correta (autenticar primeiro, depois autorizar), como trabalhar com múltiplos usuários na mesma transação, e a possibilidade de personalizar a verificação com `__check_auth`.

**Boas Práticas de Segurança:** Você dominou o threat modeling com STRIDE, entendeu como criar matrizes de risco, e conheceu as principais medidas de mitigação usadas por profissionais.

**Hands-on:** Você aplicou todos esses conceitos em um projeto prático - o simulador de estacionamento - que demonstra TTL, autenticação e práticas de segurança em ação.

Você não é mais um desenvolvedor iniciante. Você agora pensa como um engenheiro de segurança blockchain.

---

## Lição de Casa: Consolidando Seu Aprendizado

### Desafio de Aprendizagem

**Nível Fácil:** Liste quais dados do seu contrato poderiam usar Temporary versus Persistent storage e justifique o TTL apropriado para cada um. Este exercício vai solidificar sua compreensão das diferenças econômicas e técnicas entre os tipos de storage.

**Nível Médio:** Desenhe um diagrama de fluxo de dados (DFD) do seu projeto e aplique STRIDE a pelo menos duas ameaças, propondo mitigações específicas. Este é o tipo de análise que empresas sérias fazem antes de lançar produtos.

**Nível Difícil:** Aplique testes fuzzy no seu contrato. Configure um ambiente de fuzzing e deixe rodando por algumas horas. Você pode se surpreender com os edge cases que vai encontrar.

### Desafio de Carreira

Publique no LinkedIn ou Twitter um resumo do que aprendeu sobre segurança em smart contracts e threat modeling. Inclua um DFD simples do seu projeto e marque a comunidade Stellar e a NearX.

Este tipo de conteúdo demonstra para o mercado que você não apenas sabe programar, mas entende os aspectos críticos de segurança que fazem a diferença em projetos reais.

### Desafio de Comunidade

Compartilhe seu DFD e matriz de mitigação no Discord da nossa turma. Mais importante ainda: dê feedback construtivo em pelo menos dois projetos de colegas.

Aprender a revisar código e arquitetura de outros desenvolvedores é uma habilidade essencial para crescer na carreira. E ajudar outros a melhorar fortalece toda a comunidade.

---

## Próxima Aula: Composabilidade em Protocolos Soroban

Na próxima aula, vamos explorar **Composabilidade em Protocolos Soroban** - como criar sistemas de contratos que trabalham juntos de forma elegante e segura.

Você vai aprender a construir protocolos modulares, reutilizáveis e que podem ser combinados com outros protocolos para criar funcionalidades ainda mais poderosas.

A jornada continua, e você está cada vez mais próximo de se tornar um engenheiro blockchain completo.

Até lá, pratique os conceitos de hoje, faça os desafios propostos, e lembre-se: cada linha de código que você escreve com segurança em mente é um passo a mais na sua evolução profissional.

Nos vemos na próxima aula!
