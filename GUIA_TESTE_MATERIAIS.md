# 📋 Guia de Teste - Registros de Reciclagem

## Problema Corrigido
O problema ocorria porque o backend estava consultando a tabela `material_types` em vez de `materials`. Ambas as tabelas tinham estruturas diferentes, causando mapeamento incorreto. 

### Correções Realizadas:
1. ✅ Corrigido controller `materialsController.js` para consultar a tabela `materials`
2. ✅ Verificado e validado todos os 12 materiais no banco de dados
3. ✅ Seed dos dados foi executado com sucesso

---

## Instruções de Teste

### Teste 1: Registrar Eletrônicos
1. Abra a página de "Registrar Reciclagem"
2. Selecione o material **"Eletrônicos" (📱)**
3. Digite uma quantidade (ex: 1 unidade)
4. Clique em "Confirmar"
5. **Resultado esperado**: Deve aparecer "Eletrônicos" nos "Últimos Registros" (NÃO "Lâmpadas")

### Teste 2: Registrar Entulho
1. No mesmo formulário, selecione **"Entulho" (🏗️)**
2. Digite uma quantidade (ex: 5 kg)
3. Clique em "Confirmar"
4. **Resultado esperado**: Deve aparecer "Entulho" nos "Últimos Registros" (NÃO "Metal")

### Teste 3: Verificar Todos os Materiais
Teste cada material listado abaixo para garantir que todos apareçam corretamente:

| ID | Material | Ícone | Unidade Padrão |
|---|---|---|---|
| 1 | Papel | 📄 | kg, g, caixa |
| 2 | Plástico | ♻️ | kg, g, unidade |
| 3 | Vidro | 🥃 | kg, g, garrafa, unidade |
| 4 | Metal | 🔩 | kg, g, lata, unidade |
| 5 | Eletrônicos | 📱 | kg, unidade |
| 6 | Óleo Vegetal | 🫙 | kg, g |
| 7 | Lâmpadas | 💡 | unidade, kg |
| 8 | Madeira | 🪵 | kg, g |
| 9 | Têxtil | 👕 | kg, g, unidade |
| 10 | Pilhas/Baterias | 🔋 | unidade, kg |
| 11 | Entulho | 🏗️ | kg, g |
| 12 | Alumínio | 🥫 | kg, g, lata, unidade |

---

## Como Verificar se Está Funcionando

### No Frontend:
- [ ] Material selecionado no formulário corresponde ao ícone correto
- [ ] Após registrar, o nome do material aparece corretamente nos "Últimos Registros"
- [ ] O ícone do material aparece correto no histórico

### No Backend (API):
Para testar a API diretamente, execute no terminal:
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:3001/api/materials" -UseBasicParsing
$response.Content | ConvertFrom-Json | Format-Table -Property id, name -AutoSize
```

### No Banco de Dados:
Para verificar os dados diretos no MySQL:
```bash
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p"Celta2020@" ecorecicla -e "SELECT * FROM materials ORDER BY id;"
```

---

## Checklist Final

- [ ] Backend reiniciado para aplicar mudanças (se necessário)
- [ ] Frontend reiniciado para limpar cache (se necessário)
- [ ] Teste 1 (Eletrônicos) passou ✅
- [ ] Teste 2 (Entulho) passou ✅
- [ ] Teste 3 (Todos os materiais) passou ✅
- [ ] Dados históricos estão mostrando nomes corretos ✅

---

## Se Ainda Houver Problemas

1. **Material não aparece no formulário**: Reinicie o servidor backend (`npm start` na pasta backend)
2. **Nome errado continua aparecendo**: Limpe o cache do navegador (Ctrl+F5) e reinicie
3. **Database não atualizado**: Execute novamente o seed_materials.sql
