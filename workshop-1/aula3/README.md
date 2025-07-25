## Roteiro da Apresentação - Dia 3: WebAssembly com Rust

Slide: Workshop: Road to Meridian
Roteiro: Hello World de novo! Sejam todos bem-vindos ao último dia do nosso Workshop: Road to Meridian! Chegamos ao gran finale do nosso intensivão de 3 dias. Hoje, vamos criar um módulo **WebAssembly** com duas funções, integrá-lo à API CRUD do Dia 2, e criar um **CRUD-E** com uma rota para executar essas funções dinamicamente. Na verdade o que você criou até agora sem você saber foi um protótipo da blockchain Stellar. Preparados para fechar com chave de ouro? Bora lá!

Slide: 2. Programação
Roteiro: Pra gente se guiar hoje, olha só o nosso roteiro. Primeiro, vamos entender a história do WebAssembly, o que ele resolve e por que as blockchains estão adotando ele. Depois, vamos mergulhar no que é WebAssembly de verdade, com suas siglas e runtimes. Em seguida, vamos criar funções em Rust que podem ser compiladas para WebAssembly. Aí, a gente vai compilar nosso código Rust para WebAssembly e transformar o arquivo `.wasm` em bytes. Depois, a gente vai integrar tudo isso na nossa API CRUD, adicionando uma rota de execução. Pra finalizar, vamos validar o resultado e fazer um _hands-on_ pra colocar a mão na massa. Muita coisa, mas vamos juntos, passo a passo!

Slide: 3. História do WebAssembly
Roteiro: Pra começar, vamos falar da história do WebAssembly, ou WASM. Pensa no WASM como uma tecnologia que veio pra resolver um monte de problemas de performance, segurança e portabilidade. Ele não é um assembly tradicional, e não é só pra web, apesar do nome. Ele é um padrão de formato binário e uma máquina virtual que pode rodar em qualquer lugar: no navegador, em servidores, em blockchains. É super versátil!

Slide: O que é?
Roteiro: Pra deixar bem claro, o WebAssembly é uma plataforma de execução super segura e agnóstica ao host. Isso significa que ele não se importa onde ele está rodando, seja no seu navegador, no seu servidor ou até numa blockchain. Ele não é um assembly no sentido tradicional, e o nome "Web" pode enganar, porque ele vai muito além da web. Ele é um padrão de formato binário e uma máquina virtual abstrata que pode ser implementada em qualquer sistema. É uma tecnologia que veio pra revolucionar a forma como a gente executa código.

Slide: Como surgiu?
Roteiro: O WebAssembly nasceu lá em 2015, pelas mãos do Graydon Hoar, enquanto ele trabalhava na Mozilla. Ele era a evolução natural do `asm.js`, que era um jeito de otimizar o JavaScript. Em 2017, ele se tornou um padrão oficial do W3C, que é tipo o órgão que define os padrões da internet. Ele nasceu com o foco em rodar código de alto desempenho no navegador, tipo C++ e Rust, mas logo se expandiu para servidores, blockchain e até edge computing. É uma história de sucesso de uma tecnologia que começou pequena e se tornou gigante.

Slide: Quais aplicações?
Roteiro: O WebAssembly tem um monte de aplicações incríveis! Pra games, ele permite rodar engines como Unity e Unreal direto no navegador. Pra aplicativos web pesados, como Figma e Photoshop online, ele garante uma performance incrível. Pra inteligência artificial e machine learning, ele permite rodar modelos localmente no navegador. E o mais legal pra gente: ele é super importante pra blockchain, pra execução segura de smart contracts, como na Polkadot, CosmWasm e Near. Ele também é usado em edge computing e pra criar plugins seguros. É uma tecnologia que está em todo lugar!

Slide: Por que Blockchains Adotam WASM?
Roteiro: Agora, a pergunta de um milhão de dólares: por que as blockchains estão adotando o WebAssembly? Simples: performance, segurança e flexibilidade. Contratos inteligentes em WASM são muito mais rápidos que em outras tecnologias, o que é crucial pra escalabilidade. Ele permite escrever contratos em várias linguagens, não só em uma específica. Garante que o mesmo código vai ter o mesmo resultado em qualquer lugar, o que é essencial pra validação de transações. O ambiente sandboxed do WASM reduz a chance de vulnerabilidades. E facilita a comunicação entre diferentes blockchains. É por isso que o WASM é o futuro das blockchains!

Slide: 4. O que é WebAssembly?
Roteiro: Agora que a gente já sabe a história, vamos mergulhar no que é WebAssembly de verdade, e entender o ecossistema em volta dele. A gente vai falar de WASM, WASI, WAT, Wasmer e Wasmtime. Parece sopa de letrinhas, mas é bem tranquilo, vem cá...

Slide: WAT (WebAssembly Text Format)
Roteiro: O WAT, ou WebAssembly Text Format, é a representação textual do WASM. Pensa que é como o código-fonte de um programa, mas para o WebAssembly. Ele é legível por humanos, o que é super útil pra gente depurar ou até escrever WASM na mão, se for o caso. É como olhar por trás da cortina e ver como as coisas funcionam de verdade.

Slide: Exemplo em WAT
Roteiro: Olha só um exemplo de código em WAT. Parece um pouco estranho no começo, mas é bem lógico. A gente define um módulo, uma função `add` que recebe dois parâmetros e retorna um resultado. E aí a gente faz as operações. Repara que esse exemplo adiciona 1 à soma, é só pra ilustrar. É a forma textual de representar o que o WebAssembly vai executar.

Slide: WASM (WebAssembly)
Roteiro: O WASM, ou WebAssembly, é o formato binário que a gente gera. Pensa que é como o arquivo executável do seu programa, mas para o ambiente WebAssembly. Ele é agnóstico ao host, ou seja, ele não sabe nada sobre o sistema de arquivos, rede ou relógio por padrão. Isso o torna super seguro e portátil. É o artefato final que a gente vai rodar.

Slide: WASI (WebAssembly System Interface)
Roteiro: O WASI, ou WebAssembly System Interface, é uma especificação que permite que os módulos WASM acessem funcionalidades do sistema, como arquivos, rede, variáveis de ambiente e tempo. Pensa que é como uma ponte entre o WASM e o sistema operacional. Ele garante que esse acesso seja feito de forma segura, determinística e multiplataforma. É o que permite que o WASM vá além do navegador e rode em servidores e outros ambientes.

Slide: Runtimes WASM
Roteiro: Pra rodar os módulos WASM, a gente precisa de um `runtime`. Pensa que é como o motor que executa o código. Existem vários, mas vamos falar de três importantes: Wasmi, Wasmtime e Wasmer. O Wasmi é um interpretador puro em Rust, super leve e bom pra embutir em outras aplicações. O Wasmtime é focado em performance e compatibilidade com o WASI, ótimo pra linha de comando. E o Wasmer é super portátil, pode empacotar aplicações pra rodar em qualquer lugar. Cada um tem seu uso ideal, e a gente vai usar o `wasmi` hoje.

Slide: Nosso Foco Hoje
Roteiro: Pra hoje, nosso foco vai ser em quatro pontos principais. Primeiro, a gente vai refatorar nossa biblioteca de calculadora pra um módulo WebAssembly. Depois, vamos refatorar nosso CRUD pra ele conseguir suportar e executar esses módulos WASM. Em seguida, a gente vai enviar o bytecode WASM para o nosso servidor. E pra executar, a gente vai usar o `wasmi`. No final, a gente vai entender WASM, WASI, WAT, Wasmi e Wasmtime na prática. É um dia cheio, mas super recompensador!

Slide: 5. Funções em Rust
Roteiro: Agora, vamos criar as funções em Rust que a gente vai compilar para WebAssembly. A gente vai criar um novo projeto de biblioteca, mas com umas configurações especiais pra gerar um arquivo `.wasm` bem otimizado. As funções vão ser simples: soma, multiplicação, subtração e divisão. É como preparar os ingredientes da nossa receita WebAssembly.

Slide: Criando o Projeto `wasm-math`
Roteiro: Pra começar, a gente vai criar um novo projeto de biblioteca chamado `wasm-math`. É só rodar `cargo new --lib wasm-math` e depois `cd wasm-math`. Esse projeto vai ser a base do nosso módulo WebAssembly.

Slide: Configurando o Cargo.toml
Roteiro: Agora, a gente precisa configurar o `Cargo.toml` do nosso projeto `wasm-math` pra ele gerar um arquivo `.wasm` otimizado. A gente adiciona `crate-type = ["cdylib"]` na seção `[lib]`, que diz pro Rust pra gerar uma biblioteca dinâmica. E na seção `[profile.release]`, a gente coloca umas configurações pra deixar o binário final menor e mais rápido. Isso é super importante pra WebAssembly, onde o tamanho do arquivo importa muito. É como otimizar a receita pra ela ficar perfeita.

Slide: Código das Funções (`src/lib.rs`)
Roteiro: Agora, no `src/lib.rs` do nosso projeto `wasm-math`, a gente vai escrever as funções de soma, multiplicação, subtração e divisão. Repara que a gente usa `#[no_mangle]` e `pub extern "C"`. O `#[no_mangle]` impede que o compilador mude o nome da função, garantindo que o WebAssembly consiga encontrar ela. E o `pub extern "C"` faz com que a função seja compatível com a convenção de chamada C, que é o que o WebAssembly espera. É como escrever uma receita em um idioma que todo mundo entende.

Slide: Explicação das Funções
Roteiro: Pra deixar bem claro, o `extern "C"` é super importante porque ele define como a função vai ser chamada na memória, de um jeito que o WebAssembly entende. É como ter um padrão de comunicação. E o `#[no_mangle]` é pra garantir que o nome da função não seja alterado pelo compilador, assim o runtime WASM consegue encontrar e chamar a função direitinho. Sem esses dois, a gente não conseguiria usar nossas funções Rust no WebAssembly. É a ponte entre o Rust e o mundo WASM.

Slide: 6. Compilando para WebAssembly
Roteiro: Agora que a gente escreveu o código, é hora de compilar ele para WebAssembly. É como transformar nossa receita em um bolo de verdade, mas um bolo especial que pode ser comido em qualquer lugar. A gente vai gerar o arquivo `.wasm` que é o nosso binário WebAssembly.

Slide: Instalando o Target WASM
Roteiro: Pra compilar pra WebAssembly, a gente precisa instalar um "target" especial no Rust. É só rodar `rustup target add wasm32-unknown-unknown`. Isso diz pro Rust que a gente quer compilar para um ambiente WebAssembly de 32 bits, que não conhece o sistema operacional. É um passo importante pra preparar o ambiente de compilação.

Slide: Compilando o Projeto
Roteiro: Depois de instalar o target, é só rodar `cargo build --target wasm32-unknown-unknown --release`. O `--release` é pra gerar um binário otimizado e menor, o que é ideal pra WebAssembly. Esse comando vai compilar nosso código Rust e gerar o arquivo `.wasm` que a gente precisa. É a mágica acontecendo!

Slide: Saída da Compilação
Roteiro: Depois de compilar, você vai encontrar o arquivo `math.wasm` dentro da pasta `target/wasm32-unknown-unknown/release/`. Esse é o nosso arquivo binário WebAssembly, que contém as funções que a gente criou e está pronto pra ser executado em um runtime WASM. É o nosso bolo pronto pra ser servido!

Slide: Converter Wasm para bytes
Roteiro: Pra gente conseguir enviar o nosso arquivo `.wasm` para a nossa API, a gente precisa transformar ele em uma lista de números, ou bytes. Esse comando que está na tela faz exatamente isso: ele pega o arquivo `.wasm`, transforma em uma sequência de bytes separados por vírgula, e salva tudo em um arquivo `BYTES_RESULT.txt`. É como pegar um bolo e transformar ele em uma lista de ingredientes, mas de um jeito que o computador entende. A gente vai usar essa lista de bytes pra enviar pra nossa API.

Slide: 8. Integrando com o CRUD
Roteiro: Agora, a gente vai integrar o nosso módulo WebAssembly na API CRUD que a gente fez ontem. A gente vai adicionar uma nova rota, que eu chamo de `Execute`, transformando nosso CRUD em um CRUD-E. Essa rota vai permitir que a gente envie o bytecode WASM e execute as funções que estão dentro dele dinamicamente. É como dar superpoderes à nossa API!

Slide: Configurando Dependências
Roteiro: Pra integrar o WASM na nossa API, a gente precisa adicionar uma nova dependência no `Cargo.toml` do nosso projeto CRUD: o `wasmi`. Ele é o runtime WASM que a gente vai usar pra executar o bytecode. As outras dependências já conhecemos do dia anterior. Com o `wasmi` adicionado, a gente está pronto pra dar o próximo passo.

Slide: Modelo de Dados Atualizado (`src/models.rs`)
Roteiro: A gente vai dar uma pequena atualizada no nosso modelo de dados `DataEntry` lá no `src/models.rs`. Em vez de `data1` e `data2`, a gente vai ter `func_names` (que vai ser uma lista de nomes de funções) e `bytecode` (que vai ser o nosso arquivo `.wasm` em formato de bytes). Isso permite que a gente salve o módulo WASM e os nomes das funções que ele exporta na nossa API. É como dar um upgrade no nosso cofre pra ele guardar coisas novas.

Slide: Nova Rota Execute (`src/handlers/execute.rs`)
Roteiro: Agora, a gente vai criar um novo arquivo, `src/handlers/execute.rs`, que vai ser responsável pela nossa nova rota de execução. Essa rota vai receber o ID do módulo WASM que a gente quer executar, o nome da função e os argumentos. É aqui que a mágica de rodar o WebAssembly na nossa API vai acontecer. Vamos ver o código!

Slide: `execute.rs`: Imports e Struct
Roteiro: No início do `execute.rs`, a gente importa tudo que vai precisar: o `Request` e `Response` do Tide, o nosso `AppState`, e as coisas do `serde` e `serde_json` pra lidar com JSON. E o mais importante: a gente importa as coisas do `wasmi` pra conseguir carregar e executar o módulo WASM. A gente também define uma `struct ExecRequest` que é o formato que a gente espera receber na requisição: o nome da função (`func`) e dois argumentos (`arg`). É a nossa receita de como a requisição deve vir.

Slide: `execute_fn`: Início e Validação do Body
Roteiro: A função `execute_fn` é o coração da nossa nova rota. Ela é assíncrona e recebe a requisição. A primeira coisa que a gente faz é tentar ler o corpo da requisição como JSON e transformar na nossa `ExecRequest`. Se o JSON não estiver no formato certo, a gente retorna um erro 400, que significa "requisição inválida". É como um porteiro que só deixa entrar quem tem o convite certo.

Slide: Extração do ID e Busca no HashMap
Roteiro: Depois de validar o corpo da requisição, a gente extrai o ID da URL. Esse ID vai nos dizer qual módulo WASM a gente quer executar. A gente pega o estado global da aplicação, trava o `Mutex` pra ter acesso seguro ao nosso `HashMap`, e procura o `DataEntry` com aquele ID. Se a gente não encontrar, retorna um erro 404, "não encontrado". Se encontrar, a gente pega o `bytecode` do módulo WASM que está salvo lá. É como ir na nossa biblioteca e pegar o livro certo pelo número de registro.

Slide: Carregando e Instanciando o Módulo WASM
Roteiro: Agora que a gente tem os bytes do módulo WASM, a gente usa o `wasmi` pra carregar e instanciar ele. Pensa que é como pegar o bolo que a gente fez e colocar ele na mesa pra ser servido. A gente cria um `Engine`, um `Module` a partir dos bytes, e uma `Store` pra guardar o estado da execução. Se der algum erro nesse processo, a gente retorna um erro 500, "erro interno do servidor". É a parte onde o nosso código Rust ganha a capacidade de executar o WebAssembly.

Slide: Resolvendo a Função e Executando
Roteiro: Com o módulo WASM instanciado, a gente busca a função que a gente quer executar pelo nome (`exec_req.func`). Se a função não for encontrada, a gente retorna um erro. Depois, a gente verifica se a assinatura da função está correta, ou seja, se ela espera os tipos de argumentos que a gente está passando. E aí, a gente chama a função com os argumentos que vieram na requisição. Se der algum erro na execução, a gente retorna um erro 500. É o momento em que o código WASM é executado de verdade!

Slide: Respondendo com o Resultado
Roteiro: E pra finalizar, a gente pega o resultado da execução do módulo WASM e retorna ele como um JSON na resposta HTTP. A gente define o tipo de conteúdo como JSON e retorna um status 200, que significa "OK". É a nossa API CRUD-E entregando o resultado da execução do WebAssembly para o cliente. Que legal, né? A gente conseguiu fazer o Rust executar código de outro lugar!

Slide: 9. Validando o Resultado
Roteiro: Agora que a gente implementou a rota de execução, é hora de testar tudo e ver se o nosso CRUD-E está funcionando direitinho. A gente já compilou e converteu nossa biblioteca `.wasm` para bytes. Agora, vamos enviar esses bytes para o nosso servidor e depois testar a rota de execução.

Slide: Passo 1: Salvar o .wasm no Servidor
Roteiro: Primeiro, a gente precisa salvar o nosso módulo `.wasm` no servidor. A gente vai usar o comando `curl` com o método `POST` para a rota `/data`, igual a gente fez ontem pra criar um item. Mas agora, a gente vai enviar o JSON com os `func_names` (os nomes das funções que a gente quer expor) e o `bytecode` (que é a lista de bytes do nosso arquivo `.wasm` que a gente gerou no `BYTES_RESULT.txt`). Copia e cola essa lista de bytes no comando. É como se a gente estivesse "uploading" o nosso programa WASM para a API.

Slide: Passo 2: Testar a Rota Execute
Roteiro: Agora que o nosso módulo WASM está salvo na API, a gente pode testar a rota `/execute`. A gente vai usar o comando `curl` com o método `POST` para a rota `/execute/$ID`, onde `$ID` é o ID do módulo WASM que a gente salvou. A gente envia um JSON com o nome da função que a gente quer executar (`fn`) e os argumentos (`arg`). Se tudo der certo, a API vai retornar o resultado da execução da função WASM. É a prova de que a gente conseguiu executar código WebAssembly na nossa API Rust! Que demais!

Slide: 11. Recapitulação
Roteiro: Ufa! Chegamos ao final do nosso terceiro dia de Workshop! Quanta coisa a gente viu, né? Vamos recapitular rapidinho pra fixar tudo: A gente mergulhou no mundo do WASM, entendendo o que é, o que é WASI, e o que é WAT. Vimos os runtimes WASM, como Wasmer e Wasmtime, e usamos o `wasmi` pra executar o código. Criamos funções em Rust e compilamos elas para um módulo WASM. Aprimoramos nosso `DataEntry` pra incluir os nomes das funções e o bytecode. E o mais legal: estendemos nossa API CRUD com uma rota `/execute` dinâmica, permitindo a execução de funções WASM sob demanda. E claro, validamos tudo com testes manuais. Você construiu um sistema super avançado em Rust! Parabéns pela dedicação!

Slide: 12. Lição de Casa
Roteiro: Pra você continuar praticando e fixar o que aprendeu, temos uns desafios! No desafio de aprendizagem, que tal implementar um storage para que as funções WASM tenham estado? Tem umas dicas ali pra te ajudar. E no desafio de carreira, não esqueça de postar no LinkedIn e Twitter com a hashtag #road2meridian, marcando a Stellar e a NearX. Tem também uns recursos adicionais pra você continuar seus estudos. O aprendizado não para por aqui!

Slide: 13. Encerramento do Workshop
Roteiro: Parabéns, coders! Vocês completaram o Workshop: Rust! 🏆 Dominamos bibliotecas, CRUD, e WebAssembly em apenas 3 dias. É um feito e tanto! Continuem codificando, explorando Rust, WASM, WASI, e runtimes como Wasmer e Wasmtime. O mundo da programação está esperando por vocês. Muito obrigado por participarem! Nos vemos nos próximos desafios!
