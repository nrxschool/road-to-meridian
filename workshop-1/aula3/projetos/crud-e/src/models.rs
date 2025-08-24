// Este struct representa um registro de dados do nosso CRUD.
// Ele será convertido automaticamente para JSON usando Serde.
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct DataEntry {
    pub func_names: Vec<String>, // Lista de textos
    pub bytecode: Vec<u8>,       // Lista de números inteiros (bytes)
}
