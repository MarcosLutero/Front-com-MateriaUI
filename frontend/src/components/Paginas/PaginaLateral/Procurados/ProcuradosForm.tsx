import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardMedia,
  Box,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import InputMask from 'react-input-mask';
import DeleteIcon from '@mui/icons-material/Delete';

const validationSchema = Yup.object({
  nome: Yup.string().required('Nome é obrigatório'),
  dataNascimento: Yup.date().required('Data de nascimento é obrigatória'),
  nomeMae: Yup.string().required('Nome da mãe é obrigatório'),
  nomePai: Yup.string(), 
  cpf: Yup.string()
    .length(14, 'CPF deve ter 11 dígitos')
    .required('CPF é obrigatório'),
  naturalidade: Yup.string().required('Naturalidade é obrigatória'),
  municipio: Yup.string().required('Município é obrigatório'),
});

interface FormValues {
  foto: File | null;
  fotoPreview: string | ArrayBuffer | null;
  nome: string;
  dataNascimento: string;
  nomeMae: string;
  nomePai: string;
  cpf: string;
  naturalidade: string;
  municipio: string;
}

interface ProcuradosFormProps {
  initialValues: FormValues;
  onSubmit: (values: FormValues) => void;
}

const ProcuradosForm: React.FC<ProcuradosFormProps> = ({ initialValues, onSubmit }) => {
  const defaultValues: FormValues = {
    foto: null,
    fotoPreview: '',
    nome: '',
    dataNascimento: '',
    nomeMae: '',
    nomePai: '',
    cpf: '',
    naturalidade: '',
    municipio: '',
  };

  const mergedValues = { ...defaultValues, ...initialValues };

  const [estados, setEstados] = useState<any[]>([]);
  const [municipios, setMunicipios] = useState<any[]>([]);
  const [selectedEstado, setSelectedEstado] = useState(mergedValues.naturalidade);

  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(response => response.json())
      .then(data => setEstados(data))
      .catch(error => console.error('Erro ao buscar os estados:', error));
  }, []);

    useEffect(() => {
    if (selectedEstado) {
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedEstado}/municipios`)
        .then(response => response.json())
        .then(data => setMunicipios(data))
        .catch(error => console.error('Erro ao buscar os municípios:', error));
    }
  }, [selectedEstado]);
  
  return (
    <Formik
      initialValues={mergedValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, handleChange, handleBlur, setFieldValue, handleSubmit, errors, touched }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} marginTop={1}>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box display="flex" flexDirection="row" alignItems="center" width="100%">
                <Box
                  sx={{
                    width: '100%',
                    height: '200px',
                    border: '1px dashed gray',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#f9f9f9'
                  }}
                >
                  {values.fotoPreview ? (
                    <Card sx={{ width: '100%', height: '100%' }}>
                      <CardMedia
                        component="img"
                        image={values.fotoPreview as string}
                        alt="Foto escolhida"
                        sx={{ width: '100%', height: '100%', objectFit: 'fill' }}
                      />
                    </Card>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Clique ou arraste a imagem aqui
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box mt={2} display="flex" gap={2}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const target = event.target as HTMLInputElement;
                    const file = target.files?.[0];
                    setFieldValue('foto', file);

                    const reader = new FileReader();
                    reader.onload = () => {
                      if (reader.readyState === 2) {
                        setFieldValue('fotoPreview', reader.result);
                      }
                    };
                    reader.readAsDataURL(file!);
                  }}
                  style={{ display: 'none' }}
                  id="foto-upload"
                />
                <label htmlFor="foto-upload">
                  <Button variant="contained" component="span" sx={{ fontSize: '0.75rem', padding: '8px 16px' }}>
                    {values.fotoPreview ? "Trocar Foto" : "Escolher Foto"}
                  </Button>
                </label>
                {values.fotoPreview && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setFieldValue('foto', null);
                      setFieldValue('fotoPreview', null);
                    }}
                    startIcon={<DeleteIcon />}
                  >
                    Remover
                  </Button>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Nome"
                name="nome"
                value={values.nome}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                error={touched.nome && Boolean(errors.nome)}
                helperText={touched.nome ? errors.nome : ''}
              />
              <TextField
                label="Data de Nascimento"
                name="dataNascimento"
                type="date"
                value={values.dataNascimento}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                error={touched.dataNascimento && Boolean(errors.dataNascimento)}
                helperText={touched.dataNascimento ? errors.dataNascimento : ''}
                sx={{ mt: 2 }}
              />
              <TextField
                label="Nome da Mãe"
                name="nomeMae"
                value={values.nomeMae}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                error={touched.nomeMae && Boolean(errors.nomeMae)}
                helperText={touched.nomeMae ? errors.nomeMae : ''}
                sx={{ mt: 2 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Nome do Pai"
                name="nomePai"
                value={values.nomePai}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                error={touched.nomePai && Boolean(errors.nomePai)}
                helperText={touched.nomePai ? errors.nomePai : ''}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputMask
                mask="999.999.999-99"
                value={values.cpf}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                {() => (
                  <TextField
                    label="CPF"
                    name="cpf"
                    fullWidth
                    error={touched.cpf && Boolean(errors.cpf)}
                    helperText={touched.cpf ? errors.cpf : ''}
                  />
                )}
              </InputMask>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Naturalidade</InputLabel>
                <Select
                  name="naturalidade"
                  value={values.naturalidade}
                  onChange={(e) => {
                    handleChange(e);
                    setSelectedEstado(e.target.value);
                  }}
                  onBlur={handleBlur}
                >
                  {estados.map((estado: any) => (
                    <MenuItem key={estado.id} value={estado.sigla}>
                      {estado.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Município</InputLabel>
                <Select
                  name="municipio"
                  value={values.municipio}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  disabled={!selectedEstado}
                >
                  {Array.isArray(municipios) ? municipios.map((municipio: any) => (
                    <MenuItem key={municipio.id} value={municipio.nome}>
                      {municipio.nome}
                    </MenuItem>
                  )) : null}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Enviar
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default ProcuradosForm;