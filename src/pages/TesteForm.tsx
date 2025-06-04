import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { 
  Person, 
  Email, 
  Lock, 
  LocationOn, 
  Category,
  Star
} from '@mui/icons-material';
import Navbar from '../components/Navbar/Navbar';
import FormContainer from '../components/Form/Form';
import FormField from '../components/Form/FormField/FormField';
import FormSelect, { type SelectOption } from '../components/Form/FormSelect/FormSelect';

const Dashboard: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    sexo: '',
    estado: '',
    interesses: [] as string[]
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (name: string) => (value: string | number | string[] | number[]) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSuccess('✅ Formulário funcionando perfeitamente!');
      setLoading(false);
      console.log('Dados:', formData);
    }, 1500);
  };

  const handleReset = () => {
    setFormData({
      nome: '',
      email: '',
      sexo: '',
      estado: '',
      interesses: []
    });
    setSuccess('');
  };

  const sexoOptions: SelectOption[] = [
    { value: 'masculino', label: 'Masculino' },
    { value: 'feminino', label: 'Feminino' },
    { value: 'outro', label: 'Outro' }
  ];

  const estadoOptions: SelectOption[] = [
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'PR', label: 'Paraná' },
    { value: 'RS', label: 'Rio Grande do Sul' }
  ];

  const interessesOptions: SelectOption[] = [
    { value: 'reciclagem', label: 'Reciclagem', icon: <Category /> },
    { value: 'meio-ambiente', label: 'Meio Ambiente', icon: <LocationOn /> },
    { value: 'sustentabilidade', label: 'Sustentabilidade', icon: <Star /> }
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Navbar />
      
      <FormContainer
        title="🧪 Teste FormField + FormSelect"
        subtitle="Versão simplificada e funcional"
        onSubmit={handleSubmit}
        onReset={handleReset}
        loading={loading}
        success={success}
      >
        <div className="form-row">
          <div className="form-col-6">
            <FormField
              name="nome"
              label="Nome Completo"
              value={formData.nome}
              onChange={handleChange}
              required
              startIcon={<Person />}
              placeholder="Digite seu nome"
            />
          </div>
          <div className="form-col-6">
            <FormField
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              required
              startIcon={<Email />}
              placeholder="seu@email.com"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-col-4">
            <FormSelect
              name="sexo"
              label="Sexo"
              value={formData.sexo}
              onChange={handleSelectChange('sexo')}
              options={sexoOptions}
              required
              placeholder="Selecione seu sexo"
            />
          </div>
          <div className="form-col-4">
            <FormSelect
              name="estado"
              label="Estado"
              value={formData.estado}
              onChange={handleSelectChange('estado')}
              options={estadoOptions}
              required
              placeholder="Selecione seu estado"
            />
          </div>
          <div className="form-col-4">
            <FormSelect
              name="interesses"
              label="Interesses"
              value={formData.interesses}
              onChange={handleSelectChange('interesses')}
              options={interessesOptions}
              multiple
              showChips
              placeholder="Múltipla seleção"
            />
          </div>
        </div>
      </FormContainer>
    </Box>
  );
};

export default Dashboard;