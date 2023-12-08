const GeneroLivro = {
  TEXTOS_RELIGIOSOS: "Textos Religiosos",
  TERROR: "Terror",
  COMEDIA: "Comedia",
  SUSPENSE: "Suspense",
  DRAMA: "Drama",
  HISTORIA: "Historia",
  POLICIAL: "Policial",
};

class Biblioteca {
  constructor() {
    this.acervoEntidadeBibliografica = [];
    this.acervoUsuarios = [];
    this.inserirUsuariosApi();
    this.inserirEntidadesApi();
  }

  async inserirEntidadesApi() {
    try {
      const response = await fetch(
        "https://api-Biblioteca-mb6w.onrender.com/acervo"
      );
      const data = await response.json();

      data.forEach((item) => {
        if (item.entidadeBibliografica === "Livro") {
          const novoLivro = new Livro(
            item.codigo,
            item.titulo,
            item.autor,
            item.anoPublicacao,
            "Livro",
            item.genero,
            item.emprestado,
            item.usuarioEmprestimo
          );
          this.acervoEntidadeBibliografica.push(novoLivro);
        } else if (item.entidadeBibliografica === "Revista") {
          const novaRevista = new Revista(
            item.codigo,
            item.titulo,
            item.autor,
            item.anoPublicacao,
            "Revista",
            item.edicao,
            item.emprestado,
            item.usuarioEmprestimo
          );
          this.acervoEntidadeBibliografica.push(novaRevista);
        }
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }

 

  async inserirUsuariosApi() {
    try {
      const response = await fetch(
        "https://api-Biblioteca-mb6w.onrender.com/users"
      );
      const data = await response.json();

      data.forEach((user) => {
        const novoUsuario = new Usuario(
          user.nome,
          user.registroAcademico,
          user.dataNascimento
        );
        this.acervoUsuarios.push(novoUsuario);
      });
    } catch (error) {
      console.error("Error", error);
    }
  }
 

  adicionarItem(item) {
    this.acervoEntidadeBibliografica.push(item);
    console.log("Item adicionado com sucesso!");
  }

  listarAcervo() {
    this.acervoEntidadeBibliografica.forEach((item) => {
      console.log(this.acervoEntidadeBibliografica);
    });
    return this.acervoEntidadeBibliografica;
  }

  adicionarUsuario(usuario) {
    // Verifica se o usuário é valido (TODO: fazer algo melhor depois)
    if (
      !usuario.registroAcademico ||
      !usuario.nome ||
      !usuario.dataNascimento
    ) {
      console.log("usuario invalido");
      return;
    }
    // Confere se o usuário já existe
    const userAlreadyExists = this.acervoUsuarios.find(
      (user) => user.registroAcademico === usuario.registroAcademico
    );
    if (!userAlreadyExists) {
      this.acervoUsuarios.push(usuario);
    } else {
      console.log("usuario já existe");
    }

    console.log("Usuario adicionado");
  }

  emprestarItem(codigo, registroAcademico) {
    const item = this.acervoEntidadeBibliografica.find(
      (item) => item.codigo === codigo
    );
    if (item) {
      const usuarioEmprestimo = this.acervoUsuarios.find(
        (usuario) => usuario.registroAcademico === registroAcademico
      );

      if (usuarioEmprestimo) {
        if (!item.emprestado) {
          item.emprestar(usuarioEmprestimo);
          console.log("Livro emprestado com sucesso");
        } else {
          console.log("Este livro já está emprestado.");
        }
      } else {
        console.log(
          `Usuário com registro acadêmico ${registroAcademico} não encontrado.`
        );
      }
    } else {
      console.log(`Item com código ${codigo} não encontrado no acervo.`);
    }
  }
 

  devolverItem(codigo) {
    const item = this.acervoEntidadeBibliografica.find(
      (item) => item.codigo === codigo
    );
    if (item) {
      if (item.emprestado) {
        item.devolver();
        console.log("Livro devolvido com sucesso.");
      } else {
        console.log("Este livro não está emprestado.");
      }
    } else {
      console.log(`Item com código ${codigo} não encontrado no acervo.`);
    }
  }
}

class EntidadeBibliografica {
  constructor(codigo, titulo, autor, anoPublicacao) {
    this.titulo = titulo;

    this.autor = autor;

    this.anoPublicacao = anoPublicacao;

    this.codigo = codigo;

    this.emprestado = false;

    this.usuarioEmprestimo = null;
  }

  emprestar(usuario) {
    if (this.emprestado == true) {
      console.log("O livro ja está emprestado");
    } else {
      this.emprestado = true;

      this.usuarioEmprestimo = usuario;

      console.log(`${this.titulo} foi emprestado para ${usuario.nome}.`);
    }
  }

  devolver() {
    this.emprestado = false;

    this.usuarioEmprestimo = null;

    console.log(`${this.titulo} foi devolvido.`);
  }
}

class Usuario {
  constructor(nome, registroAcademico, dataNascimento) {
    this.nome = nome;

    this.registroAcademico = registroAcademico;

    this.dataNascimento = dataNascimento;
  }
}

class Livro extends EntidadeBibliografica {
  constructor(titulo, autor, anopublicacao, codigo, genero) {
    super(titulo, autor, anopublicacao, codigo);

    this.genero = genero;
  }

  informacao() {
    console.log(`
    Título: ${this.titulo}
    Autor: ${this.autor}
    Ano de publicação: ${this.anoPublicacao}
    Código: ${this.codigo}
    Emprestado: ${this.emprestado}
    Usuário emprestado: ${this.usuarioEmprestimo}
    Genero: ${this.genero}
    `);
  }
}

class Revista extends EntidadeBibliografica {
  constructor(titulo, autor, anopublicacao, codigo, edicao) {
    super(titulo, autor, anopublicacao, codigo);
    this.edicao = edicao;
  }
  informacao() {
    console.log(`
            Código: ${this.codigo}
            Título: ${this.titulo}
            Autor: ${this.autor}
            Ano de publicação: ${this.anoPublicacao}
            Emprestado: ${this.emprestado}
            Usuário emprestado: ${this.usuarioEmprestimo}
            Genero: ${this.genero}
        `);
  }
}

//daqui pra baixo são os testes

//na entrega pede para instanciar os livros e revistas
//eu fiz na hora de criar a classe Biblioteca, está sendo
//feito nas linhas 15 e 16, confira o sucesso no
//console a seguir
const biblioteca = new Biblioteca();
console.log(biblioteca);

// Criação de um usuário
const usuario1 = new Usuario("João", "RA001", "1987-05-15");
const usuario2 = new Usuario("Maria", "54321", "1995-06-23");
const usuario3 = new Usuario("Pedro", "98765", "1982-02-01");
const usuario4 = new Usuario("Ana", "45678", "1999-09-30");
const usuario5 = new Usuario("Carlos", "87654", "2000-12-30");

// Adicionar usuário à biblioteca

biblioteca.adicionarUsuario(usuario1);
biblioteca.adicionarUsuario(usuario2);
biblioteca.adicionarUsuario(usuario3);
biblioteca.adicionarUsuario(usuario4);
biblioteca.adicionarUsuario(usuario5);

// Criação de um livro
const livro1 = new Livro("L001","O Senhor dos Anéis","Tolkien","1937","TERROR");

// Adicionar livro à biblioteca
biblioteca.adicionarItem(livro1);


// Listar o acervo da biblioteca
biblioteca.listarAcervo();

// Emprestar um item (livro) para um usuário
biblioteca.emprestarItem("L001", "RA001");

// Devolver um item (livro)
biblioteca.devolverItem("L001");

