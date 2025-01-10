"use client";
import './cadastrarProduto.css';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";

interface CadastrarProdutoProps {
    voltarParaLista: () => void;
}

export default function CadastrarProduto({ voltarParaLista }: CadastrarProdutoProps) {
    const [nome, setNome] = useState('');
    const [preco, setPreco] = useState('');
    const [quantidade, setQuantidade] = useState('');

    const formatarPreco = (valor: string) => {
        if (!valor) return "R$ 0,00"; // Retorna um valor padrão para entradas vazias
        const somenteNumeros = valor.replace(/\D/g, ""); // Remove caracteres não numéricos
        const numero = parseFloat(somenteNumeros) / 100; // Divide por 100 para representar centavos
        return numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    };

    const cadastrarProduto = () => {
        if (nome === "" || preco === "" || quantidade === "") {
            toast.warn("Por favor, preencha todos os campos!");
            return;
        }

        const precoNumber = parseFloat(preco) / 100; // Converte o valor para número decimal
        const quantidadeNumber = parseInt(quantidade);

        if (isNaN(precoNumber) || isNaN(quantidadeNumber)) {
            toast.error("Preço e quantidade devem ser números válidos.");
            return;
        }

        axios.post('http://localhost:8080/produtos', {
            nome,
            preco: precoNumber,
            quantidade: quantidadeNumber,
        })
            .then(() => {
                toast.success("Produto cadastrado com sucesso!");
                limparFormulario();
                voltarParaLista();
            })
            .catch(() => {
                toast.error("Erro ao cadastrar o produto. Tente novamente.");
            });
    };

    const limparFormulario = () => {
        setNome('');
        setPreco('');
        setQuantidade('');
    };

    return (
        <div className="container">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="form-container">
                <h1>Cadastrar Produto</h1>

                <div className="form-box">
                    <label htmlFor="nome">Nome</label>
                    <input
                        id="nome"
                        type="text"
                        placeholder="Digite o nome do produto"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                </div>

                <div className="form-box">
                    <label htmlFor="preco">Preço</label>
                    <input
                        id="preco"
                        type="text"
                        placeholder="Digite o preço do produto"
                        value={formatarPreco(preco)}
                        onChange={(e) => {
                            const somenteNumeros = e.target.value.replace(/\D/g, "");
                            setPreco(somenteNumeros); // Salva apenas os números no estado
                        }}
                    />
                </div>

                <div className="form-box">
                    <label htmlFor="quantidade">Quantidade</label>
                    <input
                        id="quantidade"
                        type="text"
                        placeholder="Digite a quantidade"
                        value={quantidade}
                        onChange={(e) => setQuantidade(e.target.value)}
                    />
                </div>

                <div className="form-footer">
                    <p className="voltar" onClick={voltarParaLista}>Voltar</p>
                    <p className="confirmar" onClick={cadastrarProduto}>Cadastrar</p>
                </div>
            </div>
        </div>
    );
}
