# Configuração de SPF + DKIM + DMARC no Registro.br

## Objetivo
Garantir que os e-mails enviados pela MarIA (via Resend) não caiam em spam e tenham autenticidade verificada.

---

## Pré-requisitos
- Acesso ao painel do [Registro.br](https://registro.br) com permissão para editar DNS
- Conta no [Resend](https://resend.com) (free tier permite 100 e-mails/dia)
- Domínio: `mariapress.com.br`

---

## Passo 1: Cadastrar o Domínio no Resend

1. Acesse [resend.com/domains](https://resend.com/domains)
2. Clique em **"Add Domain"**
3. Digite: `mariapress.com.br`
4. O Resend vai gerar **3 registros DNS** que você precisa adicionar. Anote-os!

---

## Passo 2: Adicionar os Registros DNS no Registro.br

### Acessando o Painel DNS

1. Faça login em [registro.br](https://registro.br)
2. Clique no domínio `mariapress.com.br`
3. Na aba **"DNS"**, clique em **"Editar zona"**
4. Adicione os registros abaixo um por um:

---

### 2.1 — Registro SPF (TXT)

| Campo | Valor |
| :--- | :--- |
| **Nome** | `mariapress.com.br` (ou deixe em branco/@ dependendo da interface) |
| **Tipo** | `TXT` |
| **Valor** | `v=spf1 include:amazonses.com ~all` |

> [!NOTE]
> Se já existir um registro SPF, **não crie outro**. Combine-os no mesmo TXT.  
> Ex: `v=spf1 include:_spf.google.com include:amazonses.com ~all`

---

### 2.2 — Registro DKIM (CNAME)

O Resend vai gerar um CNAME específico. Os valores serão semelhantes a:

| Campo | Valor |
| :--- | :--- |
| **Nome** | `resend._domainkey.mariapress.com.br` |
| **Tipo** | `CNAME` |
| **Valor** | *(copie exatamente o que o painel do Resend informar)* |

> [!IMPORTANT]
> No Registro.br, **não inclua o domínio principal no campo "Nome"** se a interface já o adicionar automaticamente. Nesse caso, coloque apenas `resend._domainkey`.

---

### 2.3 — Registro DMARC (TXT)

| Campo | Valor |
| :--- | :--- |
| **Nome** | `_dmarc.mariapress.com.br` (ou apenas `_dmarc`) |
| **Tipo** | `TXT` |
| **Valor** | `v=DMARC1; p=none; rua=mailto:mariapress.comunica@gmail.com` |

> [!TIP]
> A política `p=none` é a mais permissiva (apenas monitora). Quando tiver confiança de que tudo funciona, você pode mudar para `p=quarantine` ou `p=reject`.

---

## Passo 3: Verificar no Resend

1. Volte ao painel do Resend em [resend.com/domains](https://resend.com/domains)
2. Clique em **"Verify DNS Records"**
3. Aguarde a propagação (geralmente de **5 minutos a 48 horas**)
4. Quando todos os 3 registros estiverem marcados com ✅, o domínio está validado!

---

## Passo 4: Atualizar o Código

Após a verificação, atualize a variável de ambiente e o remetente no código:

### Variável de Ambiente (`.env`)
```
RESEND_API_KEY=re_SuaChaveAqui
MARIA_PRESS_EMAIL=mariapress.comunica@gmail.com
```

### No arquivo `backend/src/notify.ts`, altere o `from`:
```diff
- from: 'MarIA Curadoria <onboarding@resend.dev>',
+ from: 'MarIA Curadoria <curadoria@mariapress.com.br>',
```

---

## Verificação Final

Depois de tudo configurado, use estas ferramentas para validar:

- **MX Toolbox**: [mxtoolbox.com/spf.aspx](https://mxtoolbox.com/spf.aspx) — digite `mariapress.com.br`
- **DKIM Validator**: [mxtoolbox.com/dkim.aspx](https://mxtoolbox.com/dkim.aspx) — use selector `resend`
- **DMARC Check**: [mxtoolbox.com/dmarc.aspx](https://mxtoolbox.com/dmarc.aspx) — digite `mariapress.com.br`

Se todos retornarem "Pass", seus e-mails estão blindados contra spam! 🛡️
