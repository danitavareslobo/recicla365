export interface Usuario {
  id: string;
  nome: string;
  sexo: 'Masculino' | 'Feminino' | 'Outro';
  cpf: string;
  dataNascimento: string;
  email: string;
  senha: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
}

export interface LoginData {
  email: string;
  senha: string;
}