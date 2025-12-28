# GerenciaDin
> **A forma inteligente de cuidar do seu dinheiro.**

O **GerenciaDin** é uma aplicação web completa para gestão financeira pessoal. O objetivo é simplificar o controle de receitas e despesas através de uma interface moderna, intuitiva e responsiva.

O projeto foi desenvolvido focando em performance e experiência do usuário (UX), oferecendo recursos como visualização em calendário, modo escuro e relatórios gráficos.

---

## 🚀 Tecnologias Utilizadas

O projeto foi construído com uma stack moderna focada em escalabilidade e produtividade:

- **Frontend:** [React](https://react.dev/) + [Vite](https://vitejs.dev/) (para performance extrema).
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) (design responsivo e Dark Mode nativo).
- **Backend & Auth:** [Supabase](https://supabase.com/) (Banco de dados PostgreSQL, Autenticação e Storage).
- **Ícones:** [Lucide React](https://lucide.dev/).
- **Hospedagem:** [Vercel](https://vercel.com/).

---

## ✨ Funcionalidades Principais

- **Dashboard Interativo:** Resumo financeiro com gráficos e saldo atualizado em tempo real.
- **Gestão de Transações:** Adicionar, editar e excluir receitas e despesas (com suporte a parcelamento).
- **Calendário Financeiro:** Visualização mensal com marcação de feriados nacionais e indicadores de contas a pagar/receber.
- **Sistema de Lembretes:** Nunca mais esqueça o vencimento de uma conta.
- **Autenticação Segura:** Login, Cadastro e Recuperação de Senha via e-mail (Magic Link).
- **Modo Escuro (Dark Mode):** Alternância de tema suave para conforto visual.
- **Configurações de Perfil:** Upload de foto de perfil, alteração de dados e "Zona de Perigo" para exclusão de conta.

---

## 🔧 Como rodar o projeto localmente

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/Bia-06/GerenciaDin](https://github.com/Bia-06/GerenciaDin)

2. **Instale as dependências:**
   cd gerenciadin
   npm install

3. **Configure as Variáveis de Ambiente: Crie um arquivo .env na raiz do projeto e adicione suas credenciais do Supabase:**
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase

4. **Inicie o servidor de desenvolvimento:**
   npm run dev