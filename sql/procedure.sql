USE mydb;

DELIMITER $$

CREATE PROCEDURE FinalizarCompra(IN carrinho_finalizado_id INT)
BEGIN
	-- Crie um novo registro na tabela de compras
	INSERT INTO compra (usuario_id, total, dataRegistro)
    SELECT usuario_id, total, NOW()
    FROM carrinho
    WHERE id = carrinho_finalizado_id;
    
	SET @compra_id = LAST_INSERT_ID();

	-- Mova os itens do carrinho para a tabela de itens da compra
	INSERT INTO item_compra (compra_id, produto_id, quantidade, total)
	SELECT @compra_id, produto_id, quantidade, total
	FROM item_carrinho
	WHERE carrinho_id = carrinho_finalizado_id;
    
	-- Atualize o estoque do produto
    UPDATE produto p
    JOIN item_carrinho ic ON p.id = ic.produto_id
    SET p.quantidade = p.quantidade - ic.quantidade
    WHERE ic.carrinho_id = carrinho_finalizado_id;
    
    -- Copie os dados de endereço para a tabela de endereço_entrega (se aplicável)
    INSERT INTO endereco_entrega (compra_id, logradouro, cidade, numero, uf, cep, complemento)
    SELECT @compra_id, logradouro, cidade, numero, uf, cep, complemento
    FROM endereco
    WHERE usuario_id = (SELECT usuario_id FROM carrinho WHERE id = carrinho_finalizado_id);

	-- Exclua o registro do carrinho
	DELETE FROM carrinho WHERE id = carrinho_finalizado_id;
END $$

DELIMITER ;
