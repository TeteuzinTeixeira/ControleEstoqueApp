"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Produto } from "@/entity/produto";
import './produtos.css';
import Image from "next/image";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CadastrarProduto from "@/components/cadastrarProduto/cadastrarProduto";
import Link from "next/link";

export default function Produtos() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [modal, setModal] = useState<boolean>(false);
    const [produtoSelecionado, setProdutoSelecionado] = useState<string | null>(null);
    const [exibirCadastro, setExibirCadastro] = useState<boolean>(false);
    const [filtro, setFiltro] = useState<string | null>(null);

    const deleteProduto = (id: string) => {
        axios.delete('http://localhost:8080/produtos', {
            data: { id }
        })
            .then(() => {
                setProdutos(prevProdutos => prevProdutos.filter(produto => produto.id !== id));
                setModal(false);
                toast.success("Produto excluído com sucesso!");
            })
            .catch(() => {
                toast.error("Erro ao excluir o produto. Tente novamente.");
            });
    };

    const enviarFiltro = (filtro: string) => {

        axios.get<Produto[]>(`http://localhost:8080/produtos/nome?nome=${filtro}`)
            .then(response => {
                toast.success("Filtro realizado!");
                setProdutos(response.data);
            })
            .catch(() => {
                toast.error("Erro ao realizar filtro do produto");
            });
    }

    useEffect(() => {
        axios.get<Produto[]>('http://localhost:8080/produtos')
            .then(response => {
                setProdutos(response.data);
            })
            .catch(() => {
                toast.error("Erro ao buscar produtos.");
            });
    }, []);

    const handleCadastrarClick = () => {
        setExibirCadastro(true);
    };

    const handleVoltarParaLista = () => {
        setExibirCadastro(false);
    };

    if (exibirCadastro) {
        return (
        <div className="produtos-container">
            <CadastrarProduto voltarParaLista={handleVoltarParaLista} />;
        </div>
        )
    }

    return (
        <div className="produtos-container">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="produtos-header">
                <h2 onClick={handleCadastrarClick} style={{ cursor: 'pointer' }}>Cadastrar +</h2>
                <h1>Produtos</h1>
                <div className="filtro-box">
                    <input
                        id="filtro-nome"
                        type="text"
                        placeholder="Digite o nome do produto"
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}/>
                    <div className="filtro-button" onClick={() => enviarFiltro(filtro)}>Enviar</div>
                </div>
            </div>

            <ul className="produtos-box">
                {produtos.map((produto) => (
                    <li
                        key={produto.id}
                        className={`produto-box ${produto.quantidade < 100 ? 'baixo-estoque' : ''}`} // Condicional para a classe 'baixo-estoque'
                    >
                        <div className="produto-header">
                            <p>Id: {produto.id}</p>
                            <div className="produto-header-buttons">
                                <div className="produto-header-edit">
                                    <Link href={`/${produto.id}`}>
                                        <Image src="/edit.png" alt="edit" width={20} height={20}/>
                                    </Link>
                                </div>
                                <div className="produto-header-delete"
                                    onClick={() => {
                                        setProdutoSelecionado(produto.id);
                                        setModal(true);
                                    }}>
                                    <Image src="/delete.png" alt="delete" width={20} height={20}/>
                                </div>
                            </div>
                        </div>

                        <div className="produto-body">
                            <h2>{produto.nome}</h2>
                        </div>

                        <div className="produto-footer">
                            <p>R$ {produto.preco.toFixed(2)}</p>
                            <p>Quantidade: {produto.quantidade}</p>
                        </div>
                    </li>
                ))}
            </ul>

            {modal &&
                <div className="produto-modal">
                    <div className="produto-modal-header">
                        <h1>Excluir</h1>
                    </div>
                    <div className="produto-modal-body">
                        <p>Confirmar exclusão?</p>
                    </div>
                    <div className="produto-modal-footer">
                        <p className="cancelar-button" onClick={() => setModal(false)}>Cancelar</p>
                        <p className="confirmar-button" onClick={() => {
                            if (produtoSelecionado) {
                                deleteProduto(produtoSelecionado);
                            }
                        }}>
                            Confirmar
                        </p>
                    </div>
                </div>
            }
        </div>
    );
}
