# 📱 Guia de Integração WhatsApp - Leite Materno

## Como configurar

1. **Abra o arquivo** `scripts/whatsapp-config.js`

2. **Altere o número de WhatsApp** na linha com `WHATSAPP_NUMBER`:
   ```javascript
   const WHATSAPP_NUMBER = "551187654321"; // ALTERAR PARA SEU NÚMERO
   ```

   ### Formato correto:
   - **Código do país**: 55 (Brasil)
   - **DDD**: ex: 11 (São Paulo), 81 (Pernambuco)
   - **Número**: 99999999 (8 dígitos)
   
   **Exemplo completo**: `"558134567890"` (Pernambuco)

3. **(Opcional)** Personalizar a mensagem de boas-vindas:
   ```javascript
   const WHATSAPP_GREETING = "Olá! Gostaria de fazer um pedido.";
   ```

## Como funciona

✅ Quando o usuário clica em **"Finalizar"** no carrinho:
  1. Uma mensagem é formatada com todos os produtos
  2. Mostra item, quantidade, preço e subtotal
  3. Abre o WhatsApp automaticamente
  4. Pré-preenche a mensagem com o pedido

✅ A mensagem inclui:
  - 📦 Nome e quantidade de cada produto
  - 💰 Preço unitário e total
  - 📅 Período (se for aluguel)
  - 🏷️ Valor total do pedido

## Exemplos de mensagem enviada

```
🛒 *Novo Pedido - Leite Materno*

1. *Copa Medela*
   Quantidade: 2x
   Preço unitário: R$ 150,00
   Subtotal: R$ 300,00

2. *Copo Dosador*
   Quantidade: 1x
   Preço unitário: R$ 10,00
   Subtotal: R$ 10,00

━━━━━━━━━━━━━━━━━
*TOTAL: R$ 310,00*
━━━━━━━━━━━━━━━━━

Por favor, confirme o pedido. Obrigado! 😊
```

## Testando

1. Vá até uma página com produtos (Comprar ou Alugar)
2. Adicione itens ao carrinho
3. Clique no carrinho (ícone 🛍️)
4. Clique em **"Finalizar"**
5. O WhatsApp abrirá com a mensagem pré-preenchida!

## Notas importantes

- ⚠️ O usuário precisa ter o WhatsApp instalado (web ou mobile)
- ⚠️ O número deve estar no formato correto para abrir o chat automaticamente
- ✅ Funciona em desktop (WhatsApp Web) e mobile (app nativo)
- ✅ O cliente pode editar a mensagem antes de enviar

## Suporte

Se tiver dúvidas sobre o número do WhatsApp:
- Que informação tenho? Você pode encontrar no rodapé do site ou pedir ao proprietário

---

**Configuração pronta! Agora você tem integração 100% funcional com WhatsApp! 🎉**
