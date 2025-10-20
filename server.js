const express = require('express');
const cors = require('cors');
const app = express();
// Usa a porta definida pelo ambiente (Hostinger) ou 3000 localmente
const PORT = process.env.PORT || 3000; 

// --- Configurações Iniciais ---
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// --- SIMULAÇÃO DE BANCO DE DADOS EM MEMÓRIA ---
const dbSessoes = {}; 

// --- FUNÇÃO PARA SIMULAR O CÁLCULO ASTROLÓGICO (Mapeamento de Perfil) ---
function simularCalculoAstrologico(userData) {
    const dateOfBirth = userData.date;
    const q1_answer = userData.q1_answer; // O que te move?
    
    if (!dateOfBirth) return 'Capricórnio_Aries'; 

    const date = new Date(dateOfBirth);
    const month = date.getMonth(); // 0 (Jan) a 11 (Dez)
    const day = date.getDate();
    
    // --- LÓGICA DO SIGNO SOLAR (Mapeamento de todos os 12 signos) ---
    let signo_sol; 
    
    // Mapeamento dos 12 signos
    if ((month === 11 && day >= 22) || (month === 0 && day <= 19)) { signo_sol = 'Capricórnio'; }
    else if ((month === 0 && day >= 20) || (month === 1 && day <= 18)) { signo_sol = 'Aquario'; }
    else if ((month === 1 && day >= 19) || (month === 2 && day <= 20)) { signo_sol = 'Peixes'; }
    else if ((month === 2 && day >= 21) || (month === 3 && day <= 19)) { signo_sol = 'Aries'; }
    else if ((month === 3 && day >= 20) || (month === 4 && day <= 20)) { signo_sol = 'Touro'; } 
    else if ((month === 4 && day >= 21) || (month === 5 && day <= 20)) { signo_sol = 'Gemeos'; }
    else if ((month === 5 && day >= 21) || (month === 6 && day <= 22)) { signo_sol = 'Cancer'; } 
    else if ((month === 6 && day >= 23) || (month === 7 && day <= 22)) { signo_sol = 'Leao'; } 
    else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) { signo_sol = 'Virgem'; }
    else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) { signo_sol = 'Libra'; } 
    else if ((month === 9 && day >= 23) || (month === 10 && day <= 21)) { signo_sol = 'Escorpiao'; } 
    else if ((month === 10 && day >= 22) || (month === 11 && day <= 21)) { signo_sol = 'Sagitario'; } 
    else { signo_sol = 'Capricórnio'; } // Padrão de segurança
    
    // --- LÓGICA DAS RESPOSTAS (Gerando 12 Nodos Norte Dinamicamente) ---
    
    // Calcula o "Índice Base" baseado no dia do mês (0 a 30)
    const dayIndex = day % 12; // Mapeia o dia para um índice de 0 a 11
    
    // Usa a resposta da Q1 (a, b, c) para dar um "deslocamento" no índice
    let shift = 0;
    if (userData.q1_answer === 'b') { shift = 4; } // Cooperar/Paz
    else if (userData.q1_answer === 'c') { shift = 8; } // Liderar

    const finalIndex = (dayIndex + shift) % 12;
    
    // Lista dos 12 signos na ordem que serão mapeados
    const NN_SIGNS = ['Aries', 'Touro', 'Gemeos', 'Cancer', 'Leao', 'Virgem', 
                      'Libra', 'Escorpiao', 'Sagitario', 'Capricórnio', 'Aquario', 'Peixes'];
    
    const signo_nn = NN_SIGNS[finalIndex];

    // --- COMBINAÇÃO FINAL ---
    const perfilCalculado = `${signo_nn}_${signo_sol}`;

    return perfilCalculado;
}


// --- BANCO DE INTERPRETAÇÕES (O Motor Astrológico) ---
const ASTRO_DATA = {
    // Amostra Grátis (Nodo Norte) - COBERTURA TOTAL
    nn: {
        Aries: { sign: "Áries", free: "Sua alma busca a coragem de ser pioneira e iniciar a própria jornada, desenvolvendo a autoafirmação." },
        Touro: { sign: "Touro", free: "Sua alma busca a estabilidade e o valor próprio, construindo bases sólidas com paciência." },
        Gemeos: { sign: "Gêmeos", free: "Sua alma busca a comunicação, a adaptabilidade e o aprendizado constante. Seu destino é a troca de ideias." },
        Cancer: { sign: "Câncer", free: "Sua alma busca nutrir e proteger, criando raízes emocionais fortes e valorizando a família e o passado." }, 
        Leao: { sign: "Leão", free: "Sua alma busca a autoexpressão criativa, o reconhecimento e a liderança generosa, brilhando no palco da vida." },
        Virgem: { sign: "Virgem", free: "Sua alma busca o serviço, aprimoramento e a ordem. Seu destino é curar através do método e da disciplina." },
        Libra: { sign: "Libra", free: "Sua alma busca a harmonia nos relacionamentos e a justiça. Seu destino é a cooperação e o equilíbrio, unindo os opostos." },
        Escorpiao: { sign: "Escorpião", free: "Sua alma busca aprofundar-se, renascer e transformar o mundo pela intensidade e pela verdade oculta." },
        Sagitario: { sign: "Sagitário", free: "Sua alma busca a expansão de horizontes, o conhecimento superior e a filosofia. Seu destino é a busca por grandes verdades." },
        Capricórnio: { sign: "Capricórnio", free: "Sua alma busca a construção de um legado sólido, a responsabilidade e o domínio de estruturas. Seu destino é o sucesso público." },
        Aquario: { sign: "Aquário", free: "Sua alma busca a liberdade de inovar, desafiar o status quo e liderar grupos com visão futurista." },
        Peixes: { sign: "Peixes", free: "Sua alma busca a compaixão, a arte e a dissolução do ego para se conectar ao plano espiritual e curativo." }
    },
    
    // Fallback genérico para a Vocação (usado quando a combinação NN_SOL não é encontrada)
    fallback_solar: {
        Aries: { mc: "Sua vocação é liderar pelo exemplo, abrindo caminhos e sendo o motor inicial de grandes projetos. Sua energia é de um pioneiro.", areas: "Empreendedorismo, Carreira Militar, Esportes de Alta Competição, Fundador de Startups." },
        Touro: { mc: "Sua vocação é construir valor duradouro, gerenciar recursos e criar estabilidade. Sua essência é apreciar a beleza e o prazer no trabalho.", areas: "Finanças, Arte, Agricultura, Design de Produtos, Investimento, Gastronomia de Luxo." },
        Gemeos: { mc: "Sua vocação é a comunicação, a troca de ideias e a agilidade mental. Você veio para conectar informações e pessoas.", areas: "Jornalismo, Marketing Digital, Ensino, Relações Públicas, Escrita e Publicação." },
        Cancer: { mc: "Sua vocação é nutrir, proteger e gerenciar o bem-estar emocional e físico. Você brilha em funções que exigem cuidado e forte memória afetiva.", areas: "Terapia, Gestão de Imóveis, Hotelaria, Nutrição, História, Educação Infantil, Design de Interiores." },
        Leao: { mc: "Sua vocação é brilhar, inspirar e liderar com generosidade e carisma. Seu caminho é o palco, a arte e a criação de algo único.", areas: "Atuação, Liderança Executiva, Produção Artística, Coaching, Eventos, Criação de Marcas Pessoais." },
        Virgem: { mc: "Sua vocação é o serviço, aprimoramento e análise detalhada. Você se realiza ao organizar o caos e aplicar métodos eficientes.", areas: "Auditoria, Medicina, Programação, Engenharia de Qualidade, Análise de Dados, Secretariado Executivo." },
        Libra: { mc: "Sua vocação é a diplomacia, a justiça e a criação de ambientes equilibrados. Você brilha como mediador ou através de parcerias.", areas: "Direito, Relações Internacionais, Consultoria de Imagem, Design Gráfico, Advocacia, Mediação." },
        Escorpiao: { mc: "Sua vocação é a investigação, transformação e a gestão de crises ou recursos profundos. Você veio para desvendar e regenerar.", areas: "Psicologia Investigativa, Gestão de Risco, Finanças de Alto Risco, Terapia de Trauma, Pesquisa Científica." },
        Sagitario: { mc: "Sua vocação é a expansão, o ensino e a busca por verdades maiores. Seu caminho é o mundo e a filosofia.", areas: "Ensino Superior, Viagens e Turismo, Filosofia, Publicação de Livros, Comércio Internacional, Religião." },
        Capricórnio: { mc: "Sua vocação é a construção de um legado, a ambição e o sucesso público. Você se realiza em estruturas hierárquicas e de grande responsabilidade.", areas: "Cargos Executivos (CEO), Política, Engenharia Civil, Administração Pública, Liderança Estruturada." },
        Aquario: { mc: "Sua vocação é a inovação, a tecnologia e a liderança de grupos com visão de futuro. Você veio para desafiar o status quo.", areas: "Desenvolvimento de Software, Ativismo Social, Cientista de Dados, Tecnologia da Informação, Pesquisa de Vanguarda." },
        Peixes: { mc: "Sua vocação é a arte, a cura e a espiritualidade. Você se realiza em funções que exigem intuição, compaixão e contato com o invisível.", areas: "Psicologia, Arte-Terapia, Música, Cinema, Trabalho Humanitário, Medicina Holística." }
    },
    
    // Resultados Completos (Conteúdo Premium) - 13 COMBINAÇÕES PERSONALIZADAS
    full_results: {
        'Aries_Peixes_Aquario': {
            nn_ns: "Sua missão de alma é sair da indecisão e buscar a coragem individual. Seu destino é ser o pioneiro da empatia.",
            sun_mc: "Com o Sol em Peixes e o Meio do Céu em Aquário, sua vocação é revolucionar sistemas e criar novas formas de liberdade coletiva, expressando sua luz através da sensibilidade espiritual.",
            vocational_areas: "Ideal para áreas que exijam inovação social, trabalho com comunidades ou tecnologia, e carreiras que permitam usar a intuição para guiar mudanças progressivas (Psicologia Social, Design Thinking, Ativismo)."
        },
        'Escorpiao_Aries': {
            nn_ns: "Seu Nodo Norte em Escorpião exige que você mergulhe nas profundezas e cure traumas, transformando o medo em poder. Você precisa buscar a coragem individual.",
            sun_mc: "Com o Sol em Áries, você expressa sua essência através da iniciativa. Sua vocação é abrir novos caminhos e ser o motor de arranque para projetos de alto impacto.",
            vocational_areas: "Ideal para áreas de pesquisa profunda, finanças de alto risco, psicologia clínica, ou qualquer carreira que exija coragem para desvendar o que está escondido ou transformar crises em oportunidades."
        },
        'Leao_Peixes': {
            nn_ns: "Seu Nodo Norte em Leão chama você para o centro do palco: expressar sua criatividade e sua luz individual sem medo. O passado pede para abandonar a dependência de grupos.",
            sun_mc: "Com o Sol em Peixes, você brilha através da sua sensibilidade, compaixão e talento artístico. Sua vocação é usar a arte, a inspiração ou a cura espiritual para tocar o coração das massas.",
            vocational_areas: "Ideal para áreas artísticas (Teatro, Música, Cinema), trabalho humanitário de grande escala, ou qualquer função que exija que você seja um líder carismático, porém empático."
        },
        'Libra_Gemeos': {
            nn_ns: "Seu Nodo Norte em Libra exige que você desenvolva a arte da parceria e do relacionamento justo. O passado pede que abandone o foco excessivo no 'eu' para encontrar a harmonia.",
            sun_mc: "Com o Sol em Gêmeos, sua essência é a comunicação, a curiosidade e a troca de ideias. Sua vocação é mediar, negociar e conectar pessoas através da palavra falada ou escrita.",
            vocational_areas: "Ideal para áreas de jornalismo, relações públicas, mediação legal, vendas, ou qualquer carreira que se beneficie de uma mente ágil e da capacidade de criar pontes entre lados opostos."
        },
        'Escorpiao_Virgem': {
            nn_ns: "Seu Nodo Norte em Escorpião chama para a regeneração. O passado pede que use sua capacidade analítica para investigar a fundo, e não apenas para organizar o trivial.",
            sun_mc: "Com o Sol em Virgem, você expressa sua essência através da organização, do serviço e da busca pela perfeição. Sua vocação é aplicar sua mente detalhista para transformar sistemas.",
            vocational_areas: "Ideal para áreas de auditoria, laboratórios de pesquisa, saúde pública, ou qualquer função que exija que você mergulhe profundamente nos detalhes para purificar e curar."
        },
        'Escorpiao_Aquario': {
            nn_ns: "Seu Nodo Norte em Escorpião encontra o Sol em Aquário. Sua missão é revolucionar a sociedade usando sua profunda capacidade de transformação. Você é um agente de mudança com intensidade emocional.",
            sun_mc: "Sua vocação é aplicar o conhecimento técnico e a visão futurista para desvendar mistérios sociais e psicológicos. Você expressa sua luz buscando a verdade para o bem coletivo.",
            vocational_areas: "Ideal para projetos de pesquisa de vanguarda, engenharia genética, tecnologia ética, ou liderança em movimentos de transformação social (Cientista de Dados, Líder de ONGs Progressistas)."
        },
        'Leao_Capricórnio': {
            nn_ns: "Seu Nodo Norte em Leão exige que você assuma sua autoridade criativa no mundo. O passado pede que você confie em seu brilho inato e pare de se esconder atrás de títulos.",
            sun_mc: "Com o Sol em Capricórnio, sua vocação é construir um legado público de grande sucesso e reconhecimento, gerenciando estruturas com integridade e ambição. Sua expressão é a do líder responsável.",
            vocational_areas: "Ideal para altos cargos executivos, política, gestão de instituições de arte ou qualquer função que una a ambição de Capricórnio com a necessidade de ser uma figura central."
        },
        'Libra_Aquario': {
            nn_ns: "Seu Nodo Norte em Libra chama para a justiça e a harmonia nas relações. Sua missão é mediar entre a inovação e a tradição, garantindo que o progresso beneficie todos.",
            sun_mc: "Com o Sol em Aquário, sua essência é idealista e focada em causas sociais. Sua vocação é criar parcerias em grupos e comunidades, usando a inteligência coletiva para projetar um futuro mais equitativo.",
            vocational_areas: "Ideal para recursos humanos, direito internacional, design de sistemas colaborativos ou qualquer área que exija diplomacia e visão futurista (Mediador Comunitário, Consultor de RH, Designer de UX/UI)."
        },
        'Escorpiao_Touro': {
            nn_ns: "Seu Nodo Norte em Escorpião indica uma missão de profunda transformação e gestão de crises. O passado pede que você pare de depender da estabilidade material e use seus recursos para a cura.",
            sun_mc: "Com o Sol em Touro, sua vocação é ancorar a estabilidade e o valor próprio no mundo material, aplicando sua intensidade emocional para construir algo duradouro e financeiramente seguro.",
            vocational_areas: "Ideal para investimentos de risco, gestão de patrimônio, fusões e aquisições, ou terapias que utilizam o corpo e os sentidos para a transformação."
        },
        'Leao_Cancer': {
            nn_ns: "Seu Nodo Norte em Leão chama você para expressar seu calor e criatividade no palco da vida. Sua missão é ser um líder que inspira o senso de pertencimento e proteção.",
            sun_mc: "Com o Sol em Câncer, sua vocação está ligada à nutrição, ao lar e à segurança emocional. Você brilha ao gerenciar e proteger recursos ou pessoas, atuando com grande empatia e memória afetiva.",
            vocational_areas: "Ideal para gestão de marcas de alimentos/bebidas, imóveis, educação infantil, ou qualquer área que exija a liderança baseada no cuidado e no conforto."
        },
        'Libra_Leao': {
            nn_ns: "Seu Nodo Norte em Libra exige que você encontre o equilíbrio entre o 'eu' e o 'outro', transformando o individualismo em cooperação justa. Sua missão é harmonizar as relações de poder.",
            sun_mc: "Com o Sol em Leão, sua essência é a autoexpressão e o carisma. Sua vocação é mediar disputas e criar ambientes de trabalho onde a justiça seja visível e onde as pessoas se sintam valorizadas.",
            vocational_areas: "Ideal para direito de família, relações internacionais, produção de eventos, ou qualquer função onde você possa ser um mediador carismático e justo, liderando com arte e diplomacia."
        },
        'Leao_Aries': {
            nn_ns: "Seu Nodo Norte em Leão pede que você brilhe sem medo de ser o centro, usando a iniciativa do seu Sol em Áries para se colocar em evidência. Sua missão é inspirar outros pela coragem.",
            sun_mc: "Com o Sol em Áries, sua vocação é ser o pioneiro, o fundador e o líder que abre caminhos. Sua expressão deve ser audaciosa, direta e autêntica.",
            vocational_areas: "Ideal para empreendedorismo, esportes de alta competição, liderança militar ou qualquer posição que exija risco, individualidade e coragem para começar algo novo."
        },
        'Escorpiao_Cancer': {
            nn_ns: "Seu Nodo Norte em Escorpião chama para a transformação profunda da sua vida emocional. Sua missão é usar sua sensibilidade para investigar o passado e promover a cura familiar.",
            sun_mc: "Com o Sol em Câncer, sua vocação está ligada à gestão de recursos, nutrição emocional e criação de ambientes seguros e acolhedores. Você tem talento para a investigação psicológica e o cuidado.",
            vocational_areas: "Ideal para terapia familiar, pesquisa histórica, gestão de fundos ou qualquer carreira que exija profundidade emocional e um forte instinto protetor."
        },
        'Libra_Capricórnio': {
            nn_ns: "Seu Nodo Norte em Libra busca o equilíbrio e a parceria, utilizando a ambição do Sol em Capricórnio para construir relações duradouras no âmbito profissional.",
            sun_mc: "Com o Sol em Capricórnio, sua vocação é alcançar o topo por meio da disciplina, da justiça e da ética. Você lidera com seriedade e tem habilidade para mediar grandes acordos.",
            vocational_areas: "Ideal para política, diplomacia, direito societário, ou qualquer cargo de alto escalão que exija negociação, ética e busca por um legado público."
        },
        'Leao_Touro': {
            nn_ns: "Seu Nodo Norte em Leão pede que você expresse seu valor criativo. Sua missão é brilhar usando sua teimosia taurina para manter o foco na sua arte e na sua auto-expressão.",
            sun_mc: "Com o Sol em Touro, sua vocação é a gestão de talentos, artes plásticas ou finanças. Você brilha ao valorizar o belo, o tátil e o prazer, usando a arte para obter reconhecimento.",
            vocational_areas: "Ideal para design de interiores, chef de cozinha, gestão de propriedades luxuosas, ou carreiras que unam estabilidade financeira e criatividade de alto nível."
        },
        'Escorpiao_Gemeos': {
            nn_ns: "Seu Nodo Norte em Escorpião exige que você transforme sua curiosidade mental em investigação profunda, indo além da superficialidade das informações. Seu destino é a busca por verdades ocultas.",
            sun_mc: "Com o Sol em Gêmeos, sua vocação é a comunicação investigativa. Você expressa sua essência questionando e desvendando mistérios, usando a palavra para transformar ideias complexas.",
            vocational_areas: "Ideal para jornalismo investigativo, escrita de suspense/mistério, criptografia, ou áreas que exijam comunicação precisa e capacidade de análise profunda."
        },
        'Libra_Virgem': {
            nn_ns: "Seu Nodo Norte em Libra busca o equilíbrio nos detalhes. Sua missão é trazer justiça e harmonia para o ambiente de trabalho e para os processos cotidianos.",
            sun_mc: "Com o Sol em Virgem, sua vocação é servir com excelência, usando sua habilidade de organização para mediar e aprimorar sistemas. Você brilha na diplomacia e no serviço ético.",
            vocational_areas: "Ideal para controladoria, recursos humanos, design de processos, ou qualquer área que exija precisão, organização e a capacidade de garantir justiça nas operações."
        },
        'Leao_Virgem': {
            nn_ns: "Seu Nodo Norte em Leão exige que você coloque seu trabalho em evidência e receba reconhecimento. O passado pede que você abandone a modéstia em excesso e a autocrítica destrutiva.",
            sun_mc: "Com o Sol em Virgem, sua vocação é a gestão de qualidade e o serviço impecável. Você expressa sua luz liderando com humildade e buscando a perfeição no seu ofício.",
            vocational_areas: "Ideal para edição, curadoria, coaching de performance, ou qualquer posição que combine liderança (Leão) com a atenção meticulosa aos detalhes (Virgem)."
        },
        'Escorpiao_Capricórnio': {
            nn_ns: "Seu Nodo Norte em Escorpião chama para o poder regenerador. Sua missão é usar sua ambição para criar estruturas que promovam a transformação e a cura social.",
            sun_mc: "Com o Sol em Capricórnio, sua vocação é ser uma autoridade respeitada em seu campo. Você expressa sua luz gerenciando crises e construindo um legado baseado na verdade e na profundidade.",
            vocational_areas: "Ideal para cargos de alto poder em instituições financeiras, gestão de risco, direito penal ou qualquer área que exija liderança estruturada e habilidade para lidar com o lado oculto dos negócios."
        },
        'Touro_Aries': { // Novo Perfil Adicionado
            nn_ns: "Seu Nodo Norte em Touro exige que você priorize a autossuficiência material e o foco nos seus valores. O passado pede que você abandone a impaciência e a agressividade em excesso.",
            sun_mc: "Com o Sol em Áries, sua vocação é iniciar projetos que gerem estabilidade financeira e valor duradouro. Você é um pioneiro focado em construir uma base sólida.",
            vocational_areas: "Ideal para investimentos, fundação de empresas de design, agricultura orgânica, ou qualquer área que combine a iniciativa com a busca por segurança e beleza (Arquitetura, Paisagismo)."
        },
        'Gemeos_Libra': { // Novo Perfil Adicionado
            nn_ns: "Seu Nodo Norte em Gêmeos chama você para a diversidade de interesses e para o aprendizado contínuo. Sua missão é mediar informações e conciliar diferentes pontos de vista.",
            sun_mc: "Com o Sol em Libra, sua vocação é a diplomacia e a comunicação justa. Você brilha ao equilibrar trocas, criando relações de trabalho harmoniosas e inteligentes.",
            vocational_areas: "Ideal para relações públicas, mediação, ensino de línguas, ou qualquer carreira que use a palavra para promover a harmonia e a justiça (Jornalismo de Paz, Negociação)."
        },
    }
};


// --- 1. ROTA: INICIAR O TESTE E SALVAR DADOS ---
app.post('/api/iniciar-teste', (req, res) => {
    const userData = req.body;
    
    const sessionId = 'SESS-' + Date.now(); 

    // ** LÓGICA DE CÁLCULO DINÂMICO **
    const perfilCalculado = simularCalculoAstrologico(userData); 
    const nnSign = perfilCalculado.split('_')[0]; 

    // Seleciona a amostra grátis de acordo com o cálculo
    const nnData = ASTRO_DATA.nn[nnSign] || ASTRO_DATA.nn.Aries; 
    
    // Salva a sessão no "Banco de Dados"
    dbSessoes[sessionId] = {
        userData: userData,
        perfilCalculado: perfilCalculado,
        statusPagamento: 'PENDENTE'
    };
    
    console.log(`[BACKEND] Sessão ${sessionId} criada. Perfil simulado: ${perfilCalculado}. Status: PENDENTE.`);

    res.json({ 
        success: true, 
        sessionId: sessionId,
        amostra: {
            sign: nnData.sign,
            description: nnData.free
        }
    });
});


// --- 2. ROTA: GERAR PAGAMENTO (SIMULAÇÃO) ---
app.post('/api/gerar-pagamento', (req, res) => {
    const { sessionId } = req.body;

    if (!dbSessoes[sessionId]) {
        return res.status(404).json({ success: false, message: 'Sessão não encontrada.' });
    }
    
    const paymentUrlSimulado = `http://simulacao.pagamento.com/checkout/${sessionId}`;

    res.json({
        success: true,
        paymentUrl: paymentUrlSimulado,
        message: 'Redirecionando para a página de pagamento...'
    });
});


// --- 3. ROTA: CONFIRMAÇÃO DE PAGAMENTO (WEBHOOK SIMULADO) ---
app.post('/api/webhook-simulado', (req, res) => {
    const { sessionId } = req.body;

    if (!dbSessoes[sessionId]) {
        return res.status(404).json({ success: false, message: 'Sessão não encontrada.' });
    }

    dbSessoes[sessionId].statusPagamento = 'PAGO';

    console.log(`[BACKEND] Sessão ${sessionId} atualizada. Status: PAGO.`);

    res.json({ success: true, message: 'Pagamento confirmado e resultado liberado.' });
});


// --- 4. ROTA: BUSCAR RESULTADO FINAL (COM FALLBACK DINÂMICO) ---
app.get('/api/ver-resultado/:sessionId', (req, res) => {
    const sessionId = req.params.sessionId;
    const session = dbSessoes[sessionId];

    if (!session) {
        return res.status(404).json({ success: false, message: 'Sessão expirada ou não encontrada.' });
    }

    if (session.statusPagamento !== 'PAGO') {
        return res.status(403).json({ 
            success: false, 
            message: 'Acesso negado. O pagamento não foi confirmado.' 
        });
    }

    // Tenta buscar o resultado completo personalizado
    let resultadoCompleto = ASTRO_DATA.full_results[session.perfilCalculado];

    if (!resultadoCompleto) {
        // --- Lógica de FALLBACK DINÂMICO ---
        const [nnKey, solKey] = session.perfilCalculado.split('_');
        const nnData = ASTRO_DATA.nn[nnKey] || ASTRO_DATA.nn.Aries; 
        const solFallback = ASTRO_DATA.fallback_solar[solKey] || ASTRO_DATA.fallback_solar.Aries; 

        console.log(`[BACKEND] Usando Fallback Dinâmico para o perfil: ${session.perfilCalculado}`);
        
        // CORREÇÃO AQUI: Criar o objeto completo e bem formatado
        resultadoCompleto = {
            nn_ns: `SUA ANÁLISE DINÂMICA (Nodo Norte em ${nnData.sign}): ${nnData.free}. Sua missão de alma se integra à sua essência solar de ${solKey}.`,
            sun_mc: solFallback.mc,
            vocational_areas: solFallback.areas
        };
    }

    res.json({
        success: true,
        perfil: session.perfilCalculado,
        analise: resultadoCompleto
    });
});


// --- Inicialização do Servidor (VERSÃO CORRIGIDA) ---
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor escutando na porta ${PORT}`);
    console.log('API pronta para receber dados do frontend (astrolab.html).');
});
