// variavel global para controle da rodada
var rodada = 1;
//
var matriz_jogo = Array(3);
// cada linha (a,b,c) recebe um array de 3 posições
matriz_jogo['a'] = Array(3);
matriz_jogo['b'] = Array(3);
matriz_jogo['c'] = Array(3);
// inserindo valor inicial 0 para todos os indices 
for (var i = 0; i < matriz_jogo.length; i++) {
    matriz_jogo['a'][i] = 0;
    matriz_jogo['b'][i] = 0;
    matriz_jogo['c'][i] = 0;
}
/* inicialização */
$(document).ready(function() {
    $('#btn_iniciar_jogo').click(function() {
        // valida a digitação dos apelidos dos jogadores
        // val: captura o value do elemento
        if ($('#entrada_apelido_jogador_1').val() == '') {
            //alert('Apelido do jogador 1 não foi preenchido');
            $('#msg_erro_apelido').html('Apelido do jogador 1 não foi preenchido !');
            return false;
        }
        if ($('#entrada_apelido_jogador_2').val() == '') {
            //alert('Apelido do jogador 2 não foi preenchido');
            $('#msg_erro_apelido').html('Apelido do jogador 2 não foi preenchido !');
            return false;
        }
        //exibir os apelidos
        // html: funciona como o innerhtml, insere um conteúdo em um elemento html
        $('#nome_jogador_1').html($('#entrada_apelido_jogador_1').val());
        $('#nome_jogador_2').html($('#entrada_apelido_jogador_2').val());
        // controla a visualização das divs
        $('#pagina_inicial').hide();
        $('#palco_jogo').show();
        // função que avisa a vez de tal jogador
        vez_jogador();
        // somente para ocultar a msg de vencedor e deu velha no momento
        $('.msg_vencedor').hide();
        $('#deu_velha').hide();
    });
    // evento click atribuido a classe para cada posição do grid
    $('.jogada').click(function() {
        // this: o elemento em si
        var id_campo_clicado = this.id;
        // evitar que um campo já clicado seja clicado novamente
        $('#' + id_campo_clicado).off();
        // chama a função jogada e passa o id como parametro
        jogada(id_campo_clicado);
    });

    function jogada(id) {
        var icone = '';
        var ponto = 0;
        // identifica de quem eh a jogada no momento, sabendo-se que o jogador 1 jogará nas rodadas impares e o jog. 2 nas rodadas pares
        // feita a verificação, o jog.1 marca o ponto -1 e o jog.2 marca o ponto 1, no fim a rodada eh incrementada
        if ((rodada % 2) == 1) {
            // atribui a variavel icone, os icones de circulo e X
            icone = 'url("imagens/marcacao_1.png")';
            ponto = -1;
        } else {
            icone = 'url("imagens/marcacao_2.png")';
            ponto = 1;
        }
        // incrementa rodada
        rodada++;
        // faz a marcação com os icones de circulo e X
        // css: recebe como parametro o atributo a ser alterado e o valor
        $('#' + id).css('background-image', icone);
        vez_jogador();
        // o split irá quebrar o id com base no '-', e armazena na variavel como um array
        // ex.: ficará linha_coluna[0]: 'a' e linha_coluna[1]: '1'
        var linha_coluna = id.split('-');
        // é feita a atribuição do ponto(-1 ou 1) em matriz_jogo com base na posição clicada
        matriz_jogo[linha_coluna[0]][linha_coluna[1]] = ponto;
        //
        verifica_combinacao();
    };
    // função que verifica se a combinação de vitória foi feita por algum jogador
    function verifica_combinacao() {
        // verifica na horizontal
        var pontos = 0;
        for (var i = 1; i <= 3; i++) {
            // faz a soma dos pontos das posições
            pontos += matriz_jogo['a'][i];
        }
        ganhador(pontos);
        // o msm para a horizontal de b, c . Antes deve-se zerar a variavel pontos
        pontos = 0;
        for (var i = 1; i <= 3; i++) {
            // faz a soma dos pontos das posições
            pontos += matriz_jogo['b'][i];
        }
        ganhador(pontos);
        //
        pontos = 0;
        for (var i = 1; i <= 3; i++) {
            // faz a soma dos pontos das posições
            pontos += matriz_jogo['c'][i];
        }
        ganhador(pontos);
        //
        // verifica na vertical
        for (var l = 1; l <= 3; l++) {
            // zera a var. 'pontos' para que não some os valores de uma coluna com a outra
            pontos = 0;
            pontos += matriz_jogo['a'][l];
            pontos += matriz_jogo['b'][l];
            pontos += matriz_jogo['c'][l];
            //
            ganhador(pontos);
            //
            // zera pontos, soma a coluna, verifica, repete, simples :)
        }
        // verifica na diagonal
        pontos = 0;
        pontos = matriz_jogo['a'][1] + matriz_jogo['b'][2] + matriz_jogo['c'][3];
        ganhador(pontos);
        //
        pontos = 0;
        pontos = matriz_jogo['a'][3] + matriz_jogo['b'][2] + matriz_jogo['c'][1];
        ganhador(pontos);
        //
        // verifica se deu velha (ou seja, se o jogo chegar na décima rodada e não houver vencedor)
        if (rodada > 9) {
            $('.msg_vez_jogador').hide();
            $('#deu_velha').show();
            $('#deu_velha').html('Deu velha ! Ninguém ganhou. :(');
            $('.jogada').off();
        }
    }
    // função que controla a msg de vitória no jogo
    function ganhador(pontos) {
        if (pontos == -3) {
            // oculta a msg vez jogador para dar lugar a msg vencedor ou deu velha
            $('.msg_vez_jogador').hide();
            // mostra a msg vencedor
            $('.msg_vencedor').show();
            var apelido_1 = $('#entrada_apelido_jogador_1').val();
            $('#msg_vencedor').html(apelido_1);
            // para que o evento click seja desabilitado depois do fim do jogo
            $('.jogada').off();
        } else if (pontos == 3) {
            $('.msg_vez_jogador').hide();
            $('.msg_vencedor').show();
            var apelido_2 = $('#entrada_apelido_jogador_2').val();
            $('#msg_vencedor').html(apelido_2);
            $('.jogada').off();
        }
    }
    // função que avisa a vez de tal jogador
    function vez_jogador() {
        if ((rodada % 2) == 1) {
            $('#msg_vez_jogador').html($('#entrada_apelido_jogador_1').val());
        } else {
            $('#msg_vez_jogador').html($('#entrada_apelido_jogador_2').val());
        }
    };
    // 
    $('#btn-voltar').click(function() {
        window.location.reload()
    });
})