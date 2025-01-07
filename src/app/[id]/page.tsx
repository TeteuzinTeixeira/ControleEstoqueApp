"use client";
import { useRouter } from "next/navigation";
import '../../components/cadastrarProduto/cadastrarProduto.css';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect } from "react";
import { Produto } from "@/entity/produto";
import Link from "next/link";

interface ProductPageProps {
    params: { id: string };
}

export default function AtualizarProduto({ params }: ProductPageProps) {
    const [nome, setNome] = useState('');
    const [preco, setPreco] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [produtoId, setProdutoId] = useState('');
    const router = useRouter();

    useEffect(() => {
        axios.get<Produto>(`http://localhost:8080/produtos/${params.id}`)
            .then(response => {
                const produto = response.data;
                setProdutoId(produto.id);
                setNome(produto.nome);
                setPreco(produto.preco.toString());
                setQuantidade(produto.quantidade.toString());
            })
            .catch(() => {
                toast.error("Erro ao buscar produto.");
            });
    }, [params.id]);

    const atualizarProduto = () => {
        if (nome === "" || preco === "" || quantidade === "") {
            toast.warn("Por favor, preencha todos os campos!");
            return;
        }

        const precoNumber = parseFloat(preco);
        const quantidadeNumber = parseInt(quantidade);

        if (isNaN(precoNumber) || isNaN(quantidadeNumber)) {
            toast.error("Preço e quantidade devem ser números válidos.");
            return;
        }

        axios.put('http://localhost:8080/produtos', {
            id: produtoId,
            nome,
            preco: precoNumber,
            quantidade: quantidadeNumber,
        })
            .then(() => {
                toast.success("Produto atualizado com sucesso!");
                router.push("/");
            })
            .catch(() => {
                toast.error("Erro ao atualizar o produto. Tente novamente.");
            });
    };

    return (
        <div className="container-atualizar">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="form-container-atualizar">
                <h1>Atualizar Produto</h1>

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
                        value={preco}
                        onChange={(e) => setPreco(e.target.value)}
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
                    <Link href="/">
                        <p className="voltar-atualizar">Voltar</p>
                    </Link>
                    <p className="confirmar" onClick={atualizarProduto}>Atualizar</p>
                </div>
            </div>
        </div>
    );
}
