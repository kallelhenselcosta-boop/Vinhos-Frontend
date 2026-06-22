import { useState, useEffect } from 'react';
import Alerta from './Alerta';

function Vinho() {
    const [listaObjetos, setListaObjetos] = useState([]);
    const [alerta, setAlerta] = useState({ status: "", message: "" });
    const [editar, setEditar] = useState(false);
    const [objeto, setObjeto] = useState({
        "id": "", "nome": "", "tipo": "", "safra": "", "preco": "", "quantidade_estoque": ""
    });

    const novoObjeto = () => {
        setEditar(false);
        setAlerta({ status: "", message: "" });
        setObjeto({ "id": 0, "nome": "", "tipo": "", "safra": "", "preco": "", "quantidade_estoque": "" });
    }

    const recuperaLista = async () => {
        await fetch(`http://localhost:3002/vinhos`)
            .then(response => response.json())
            .then(data => setListaObjetos(data))
            .catch(err => console.log(err));
    }

    const editarObjeto = async id => {
        setEditar(true);
        setAlerta({ status: "", message: "" });
        await fetch(`http://localhost:3002/vinhos/${id}`)
            .then(response => response.json())
            .then(data => setObjeto(data))
            .catch(err => console.log(err));
    }

    const acaoCadastrar = async e => {
        e.preventDefault();
        const metodo = editar ? "PUT" : "POST";
        try {
            await fetch(`http://localhost:3002/vinhos`, {
                method: metodo,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(objeto),
            })
            .then(response => response.json())
            .then(json => {
                setAlerta({ status: json.status, message: json.message });
                setObjeto(json.objeto);
                if (!editar) setEditar(true);
                recuperaLista();
            });
        } catch (err) { console.log(err.message); }
    }

    const remover = async id => {
        if (window.confirm("Deseja remover este vinho?")) {
            try {
                await fetch(`http://localhost:3002/vinhos/${id}`, { method: "DELETE" })
                    .then(response => response.json())
                    .then(json => {
                        setAlerta({ status: json.status, message: json.message });
                        recuperaLista();
                    });
            } catch (err) { console.log(err.message); }
        }
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setObjeto({ ...objeto, [name]: value });
    }

    useEffect(() => { recuperaLista(); }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Cadastro de Vinhos (Estoque)</h1>
            <Alerta alerta={alerta} />
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalEdicao" onClick={novoObjeto}>
                Novo Vinho <i className="bi bi-file-earmark-plus"></i>
            </button>
            
            <table className="table table-striped mt-3">
                <thead>
                    <tr>
                        <th scope="col" style={{ textAlign: 'center' }}>Ações</th>
                        <th scope="col">ID</th>
                        <th scope="col">Nome</th>
                        <th scope="col">Tipo</th>
                        <th scope="col">Safra</th>
                        <th scope="col">Preço</th>
                        <th scope="col">Estoque</th>
                    </tr>
                </thead>
                <tbody>
                    {listaObjetos.map(obj => (
                        <tr key={obj.id}>
                            <td align="center">
                                <button className="btn btn-info me-2" data-bs-toggle="modal" data-bs-target="#modalEdicao" onClick={() => editarObjeto(obj.id)}>
                                    <i className="bi bi-pencil-square"></i>
                                </button>
                                <button className="btn btn-danger" title="Remover" onClick={() => remover(obj.id)}>
                                    <i className="bi bi-trash"></i>
                                </button>
                            </td>
                            <td>{obj.id}</td>
                            <td>{obj.nome}</td>
                            <td>{obj.tipo}</td>
                            <td>{obj.safra}</td>
                            <td>R$ {obj.preco}</td>
                            <td>{obj.quantidade_estoque}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="modal fade" id="modalEdicao" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Vinho</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={acaoCadastrar} className="needs-validation">
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="txtId" className="form-label">ID</label>
                                    <input type="number" className="form-control" id="txtId" name="id" value={objeto.id} readOnly />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="txtNome" className="form-label">Nome</label>
                                    <input type="text" className="form-control" id="txtNome" name="nome" value={objeto.nome} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="txtTipo" className="form-label">Tipo</label>
                                    <input type="text" className="form-control" id="txtTipo" name="tipo" value={objeto.tipo} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="txtSafra" className="form-label">Safra</label>
                                    <input type="number" className="form-control" id="txtSafra" name="safra" value={objeto.safra} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="txtPreco" className="form-label">Preço</label>
                                    <input type="number" step="0.01" className="form-control" id="txtPreco" name="preco" value={objeto.preco} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="txtEstoque" className="form-label">Quantidade em Estoque</label>
                                    <input type="number" className="form-control" id="txtEstoque" name="quantidade_estoque" value={objeto.quantidade_estoque} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                                <button type="submit" className="btn btn-success" data-bs-dismiss="modal">Salvar <i className="bi bi-save"></i></button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Vinho;