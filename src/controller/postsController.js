import {getTodosPosts , criarPost, atualizarPost }from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js"

export async function listarPosts (req, res) {
    // Chama a função para buscar os posts e armazena o resultado em uma variável.
    const posts = await getTodosPosts();
    // Envia uma resposta HTTP com status 200 (sucesso) e os posts no formato JSON.
    res.status(200).json(posts);
  }

  export async function postarNovoPost(req, res) {
    const novoPost = req.body;
    try {
      const postCriado = await criarPost(novoPost)
      res.status(200).json(postCriado); 
    } catch(erro) {
      console.error(erro.message);
      res.status(500).json({"Erro":"Falha na requisição"})
    }
    //body é o conteúdo do pedido
  }

  export async function uploadImagem(req, res) {
    const novoPost = {
      descricao: "",
      imgUrl: req.file.originalname,
      txtAlt: ""
    };

    try {
      const postCriado = await criarPost(novoPost)
      const imagemAtualizada = `uploads/${postCriado.insertedId}.png`
      fs.renameSync(req.file.path, imagemAtualizada)
      res.status(200).json(postCriado); 
    } catch(erro) {
      console.error(erro.message);
      res.status(500).json({"Erro":"Falha na requisição"})
    }

  }

  export async function atualizarNovoPost(req, res) {
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`
    
    try {
      const imgBuffer = fs.readFileSync(`uploads/${id}.png`)
      const descricao = await gerarDescricaoComGemini(imgBuffer)

      const post = {
        imgUrl: urlImagem,
        descricao: descricao,
        txtAlt: req.body.txtAlt
      }

      const postCriado = await atualizarPost(id, post)

      res.status(200).json(postCriado); 
    } catch(erro) {
      console.error(erro.message);
      res.status(500).json({"Erro":"Falha na requisição"})
    }

  }