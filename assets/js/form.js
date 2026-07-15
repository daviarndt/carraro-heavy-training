/* ============================================================
   CARRARO — Diagnóstico Inteligente (multi-step → score → WhatsApp)
   ============================================================ */

// WhatsApp da closer do Renan (a responsável por vendas) — formato internacional, só dígitos.
// Por enquanto é um número de TESTE; trocar pelo número real da closer antes de publicar.
const WHATSAPP_NUMBER = "4915259100748";

// Tradução (i18n.js carrega antes deste arquivo)
const t = (key, vars) => (window.i18n ? window.i18n.t(key, vars) : key);

const form = document.getElementById("evalForm");
const steps = Array.from(form.querySelectorAll("[data-step]"));
const doneScreen = form.querySelector("[data-done]");
const progressBar = document.getElementById("progressBar");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const btnSubmit = document.getElementById("btnSubmit");
const formNav = form.querySelector(".form-nav");
const waLink = document.getElementById("waLink");

let current = 0;

// Labels for the WhatsApp message — contact block
const CONTACT_LABELS = {
  nome: "Nome",
  idade: "Idade",
  email: "E-mail",
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  pais: "País",
  estado: "Estado",
  cidade: "Cidade",
};

// Labels for the WhatsApp message — diagnostic answers block
const QUESTION_LABELS = {
  objetivo: "Objetivo principal",
  dias: "Dias de treino/semana",
  tempo: "Tempo treinando",
  interrupcoes: "Interrupções (últimos 3 meses)",
  dificuldade: "Maior dificuldade",
  estruturado: "Treino estruturado",
  registro: "Registra cargas/evolução",
  aerobico: "Aeróbico/semana",
  satisfacao: "Satisfação com resultados",
};

/* ============================================================
   Diagnósticos
   ============================================================ */
const DIAGNOSES = {
  /* ---- Objetivo: Hipertrofia e definição ---- */
  estimulo: {
    title: "Estímulo insuficiente",
    photos: ["assets/img/photos_diagnosticos/estimulo_insuficiente.jpeg"],
    profile: `
      <p>Seu principal gargalo hoje não é a falta de esforço.</p>
      <p>O principal fator que está limitando sua evolução é que o estímulo atual ainda não é suficiente para o objetivo que você deseja alcançar.</p>
      <p>Isso pode estar relacionado à frequência semanal, ao planejamento do treino, à progressão das cargas ou até mesmo à dificuldade de manter uma rotina consistente.</p>
      <p>Pequenos ajustes nessas variáveis costumam gerar uma grande diferença nos resultados ao longo dos próximos meses.</p>
    `,
    rec: `
      <p class="diag__rec-sub">O que recomendamos</p>
      <p class="diag__rec-lead">Aumente gradualmente a frequência semanal e distribua melhor o volume de treino.</p>
      <p>Uma excelente estratégia é utilizar uma divisão Upper / Lower, permitindo trabalhar todos os grupos musculares com maior frequência e qualidade.</p>
      <h4>Estrutura sugerida</h4>
      <p class="diag__rec-sub">Segunda-feira — Upper</p>
      <ul>
        <li>Remada pronada na máquina</li>
        <li>Remada supinada na máquina</li>
        <li>Remada baixa com triângulo</li>
        <li>Desenvolvimento com halteres</li>
        <li>Elevação lateral</li>
        <li>Tríceps pulley</li>
        <li>Rosca neutra</li>
      </ul>
      <p class="diag__rec-sub">Terça-feira — Lower</p>
      <ul>
        <li>Cadeira flexora</li>
        <li>Elevação pélvica</li>
        <li>Leg Press</li>
        <li>Mesa flexora</li>
        <li>Cadeira extensora</li>
        <li>Adutora</li>
      </ul>
      <p class="diag__rec-sub">Quarta-feira — Cardio</p>
      <p>Procure acumular pelo menos 120 minutos de cardio por semana. Você pode distribuir esse tempo da forma que melhor se encaixar na sua rotina, seja realizando sessões mais curtas ao longo da semana ou treinos mais longos em dias específicos. Durante o cardio, procure manter uma intensidade moderada, mantendo sua frequência cardíaca acima de aproximadamente 115 bpm (esse valor pode variar conforme sua idade e condicionamento físico).</p>
      <p class="diag__rec-sub">Quinta-feira</p>
      <p>Repetir Upper.</p>
      <p class="diag__rec-sub">Sexta-feira</p>
      <p>Repetir Lower.</p>
      <p class="diag__rec-sub">Volume sugerido</p>
      <p>Procure acumular entre 10 e 15 séries semanais por grupo muscular, distribuídas ao longo da semana.</p>
      <p class="diag__rec-sub">Como evoluir</p>
      <p>Comece registrando as cargas dos principais exercícios. Mesmo pequenas evoluções semanais representam um excelente sinal de progresso.</p>
      <p class="diag__rec-foot">Essa é uma estrutura geral. Dependendo da sua rotina, limitações e experiência, ajustes individualizados podem acelerar significativamente seus resultados.</p>
    `,
  },
  evolucao_hiper: {
    title: "Treina, mas não evolui",
    photos: ["assets/img/photos_diagnosticos/treina_mas_nao_evolui_hipertrofia.jpg"],
    profile: `
      <p>Você já possui um bom hábito de treino.</p>
      <p>Seu próximo nível de resultado depende menos de treinar mais e muito mais da qualidade do estímulo que está aplicando.</p>
    `,
    rec: `
      <p class="diag__rec-sub">O que isso significa</p>
      <p>Quando frequência e consistência já estão estabelecidas, normalmente os resultados passam a depender de detalhes como:</p>
      <ul>
        <li>Progressão de carga</li>
        <li>Intensidade</li>
        <li>Seleção de exercícios</li>
        <li>Recuperação</li>
        <li>Alimentação</li>
      </ul>
      <p class="diag__rec-sub">O que recomendamos</p>
      <p class="diag__rec-lead">Antes de aumentar ainda mais o volume de treino, procure otimizar o que você já faz.</p>
      <p class="diag__rec-sub">Como aplicar a dupla progressão</p>
      <p>Escolha uma faixa de repetições — por exemplo, de 8 a 12 repetições.</p>
      <p>Exemplo de evolução:</p>
      <ul>
        <li>Semana 1 — 60 kg × 8</li>
        <li>Semana 2 — 60 kg × 9</li>
        <li>Semana 3 — 60 kg × 10</li>
        <li>Semana 4 — 60 kg × 12</li>
        <li>Semana 5 — 65 kg × 8</li>
      </ul>
      <p>Esse processo permite evoluir continuamente sem perder qualidade.</p>
      <p class="diag__rec-sub">Intensidade</p>
      <p>Procure finalizar a maior parte das séries muito próxima da falha muscular, mantendo sempre uma boa execução. Treinar pesado é um dos fatores mais importantes para estimular hipertrofia.</p>
      <p class="diag__rec-sub">Cardio</p>
      <p>Procure acumular pelo menos 120 minutos de cardio por semana. Você pode distribuir esse tempo da forma que melhor se encaixar na sua rotina, seja realizando sessões mais curtas ao longo da semana ou treinos mais longos em dias específicos. Durante o cardio, procure manter uma intensidade moderada, mantendo sua frequência cardíaca acima de aproximadamente 115 bpm (esse valor pode variar conforme sua idade e condicionamento físico).</p>
      <p class="diag__rec-sub">Outros fatores importantes</p>
      <p>Também vale revisar:</p>
      <ul>
        <li>Alimentação</li>
        <li>Sono</li>
        <li>Hidratação</li>
        <li>Recuperação</li>
      </ul>
      <p>Esses fatores podem limitar seus resultados mesmo quando o treino está bem estruturado.</p>
      <p class="diag__rec-foot">Quando a pessoa já faz praticamente tudo certo, normalmente os resultados passam a depender de ajustes individualizados.</p>
    `,
  },

  /* ---- Objetivo: Emagrecimento ---- */
  constancia: {
    title: "Baixa constância",
    photos: [
      "assets/img/photos_diagnosticos/baixa_constancia_emagrecimento.jpg",
      "assets/img/photos_diagnosticos/baixa_constancia_2_emagrecimento.jpg",
    ],
    profile: `
      <p>Seu principal desafio hoje não é encontrar o treino perfeito.</p>
      <p>O maior desafio é conseguir manter uma rotina consistente.</p>
    `,
    rec: `
      <p class="diag__rec-sub">O que isso significa</p>
      <p>Antes de pensar em estratégias avançadas, é importante construir uma rotina sustentável. A consistência sempre será mais importante do que um treino perfeito realizado apenas ocasionalmente.</p>
      <p class="diag__rec-sub">O que recomendamos</p>
      <p class="diag__rec-lead">Comece simplificando sua rotina.</p>
      <p>Uma excelente estratégia é utilizar um treino Full Body três vezes por semana.</p>
      <h4>Estrutura sugerida</h4>
      <p>Em cada treino, procure incluir os seguintes exercícios:</p>
      <ul>
        <li>Cadeira flexora</li>
        <li>Leg Press</li>
        <li>Cadeira extensora</li>
        <li>Remada</li>
        <li>Desenvolvimento</li>
        <li>Tríceps pulley</li>
      </ul>
      <p>Nos treinos seguintes, alterne alguns exercícios, acrescentando mais um exercício para posteriores de coxa, aumentando gradualmente o volume semanal desse grupo muscular.</p>
      <p class="diag__rec-sub">Parâmetros sugeridos</p>
      <ul>
        <li>2 a 3 séries por exercício</li>
        <li>8 a 12 repetições</li>
      </ul>
      <p class="diag__rec-sub">Cardio</p>
      <p>Procure acumular pelo menos 150 minutos de cardio por semana. Você pode distribuir esse tempo da forma que melhor se encaixar na sua rotina, seja realizando sessões mais curtas ao longo da semana ou treinos mais longos em dias específicos. Durante o cardio, procure manter uma intensidade moderada, mantendo sua frequência cardíaca acima de 115 bpm (esse valor pode variar conforme sua idade e condicionamento físico). Além disso, procure permanecer ativa ao longo do dia. Caminhar mais, utilizar escadas e reduzir o tempo sentada são estratégias simples que aumentam seu gasto energético diário e contribuem para a criação de uma rotina mais consistente.</p>
      <p class="diag__rec-sub">Atividade diária</p>
      <p>Além dos treinos, procure permanecer ativa. Pequenas mudanças fazem diferença:</p>
      <ul>
        <li>Caminhar mais</li>
        <li>Utilizar escadas</li>
        <li>Passear no parque</li>
        <li>Reduzir o tempo sentado</li>
      </ul>
      <p class="diag__rec-foot">O melhor treino é aquele que você consegue manter durante meses.</p>
    `,
  },
  gasto: {
    title: "Gasto energético insuficiente",
    // TODO: foto definitiva desta aluna (placeholder mostra "Foto da aluna" até existir o arquivo)
    photos: ["assets/img/photos_diagnosticos/gasto_energetico_insuficiente.jpg"],
    profile: `
      <p>Você já mantém uma boa frequência de musculação.</p>
      <p>Agora o principal ajuste é aumentar seu gasto energético semanal.</p>
    `,
    rec: `
      <p class="diag__rec-sub">O que isso significa</p>
      <p>Provavelmente seu corpo já está adaptado ao nível atual de atividade física. Aumentar o gasto energético semanal pode acelerar significativamente o emagrecimento.</p>
      <p class="diag__rec-sub">O que recomendamos</p>
      <p class="diag__rec-lead">Mantenha um treino Full Body três vezes por semana.</p>
      <h4>Estrutura sugerida</h4>
      <p>Em cada treino, procure incluir os seguintes exercícios:</p>
      <ul>
        <li>Cadeira flexora</li>
        <li>Leg Press</li>
        <li>Cadeira extensora</li>
        <li>Remada</li>
        <li>Desenvolvimento</li>
        <li>Tríceps pulley</li>
      </ul>
      <p>Nos treinos seguintes, alterne alguns exercícios, acrescentando mais um exercício para posteriores de coxa, aumentando gradualmente o volume semanal desse grupo muscular.</p>
      <p class="diag__rec-sub">Parâmetros sugeridos</p>
      <ul>
        <li>2 a 3 séries por exercício</li>
        <li>8 a 12 repetições</li>
      </ul>
      <p class="diag__rec-sub">Cardio</p>
      <p>Procure acumular pelo menos 180 minutos de cardio por semana.</p>
      <p class="diag__rec-sub">Treine pesado</p>
      <p>Mesmo durante o emagrecimento, continue priorizando a musculação. Registre suas cargas e procure evoluir constantemente.</p>
      <p class="diag__rec-sub">Como aplicar a dupla progressão</p>
      <p>Utilize uma faixa de repetições — por exemplo, de 8 a 12. Quando atingir 12 repetições com boa execução, aumente a carga e retorne para 8.</p>
      <p class="diag__rec-sub">Intensidade</p>
      <p>Treine próximo da falha muscular. Isso ajuda a preservar massa muscular durante o processo de emagrecimento.</p>
    `,
  },
  evolucao_emag: {
    title: "Treina, mas não evolui",
    photos: [
      "assets/img/photos_diagnosticos/treina_mas_nao_evolui_emagrecimento.jpg",
      "assets/img/photos_diagnosticos/treina_mas_nao_evolui_2_emagrecimento.jpg",
    ],
    profile: `
      <p>Você já construiu hábitos importantes.</p>
      <p>Agora sua evolução depende principalmente de ajustes estratégicos.</p>
    `,
    rec: `
      <p class="diag__rec-sub">O que isso significa</p>
      <p>Seu nível de atividade já é bom. Neste momento, simplesmente treinar mais dificilmente será a solução — o foco deve estar na qualidade do estímulo.</p>
      <p class="diag__rec-sub">O que recomendamos</p>
      <p class="diag__rec-lead">Migre para uma divisão Upper / Lower, aumentando a qualidade da musculação.</p>
      <h4>Estrutura sugerida</h4>
      <p class="diag__rec-sub">Upper</p>
      <ul>
        <li>Remada pronada na máquina</li>
        <li>Remada supinada na máquina</li>
        <li>Remada baixa com triângulo</li>
        <li>Desenvolvimento com halteres</li>
        <li>Elevação lateral</li>
        <li>Tríceps pulley</li>
        <li>Rosca neutra</li>
      </ul>
      <p class="diag__rec-sub">Lower</p>
      <ul>
        <li>Cadeira flexora</li>
        <li>Mesa flexora</li>
        <li>Leg Press</li>
        <li>Cadeira extensora</li>
        <li>Adutora</li>
        <li>Elevação pélvica</li>
      </ul>
      <p class="diag__rec-sub">Como aplicar a dupla progressão</p>
      <p>Utilize uma faixa de repetições entre 8 e 12. Quando atingir o limite superior da faixa, aumente a carga e reinicie a progressão.</p>
      <p class="diag__rec-sub">Intensidade</p>
      <p>Finalize suas séries próximo da falha muscular.</p>
      <p class="diag__rec-sub">Cardio</p>
      <p>Mesmo que seu foco agora seja otimizar a qualidade da musculação, manter um bom volume de cardio continua sendo fundamental para o emagrecimento. Procure acumular pelo menos 180 minutos de cardio por semana, mantendo uma intensidade moderada, com frequência cardíaca acima de aproximadamente 115 bpm (esse valor pode variar conforme sua idade e condicionamento físico).</p>
      <p class="diag__rec-sub">Também vale revisar</p>
      <ul>
        <li>Alimentação</li>
        <li>Sono</li>
        <li>Hidratação</li>
        <li>Recuperação</li>
      </ul>
      <p class="diag__rec-foot">Esses fatores costumam fazer grande diferença para quem já possui uma boa rotina de treinos.</p>
    `,
  },
};

/* ---------- Versão em inglês dos diagnósticos (title/profile/rec) ----------
   As fotos vêm sempre de DIAGNOSES. O e-mail pro time continua usando o
   título em PT (DIAGNOSES), independente do idioma da tela. */
const DIAGNOSES_EN = {
  estimulo: {
    title: "Insufficient stimulus",
    profile: `
      <p>Your main bottleneck today is not a lack of effort.</p>
      <p>The main factor limiting your progress is that your current training stimulus is not yet enough for the goal you want to reach.</p>
      <p>This may be related to your weekly frequency, your training plan, load progression, or even the difficulty of keeping a consistent routine.</p>
      <p>Small adjustments to these variables usually make a big difference in your results over the coming months.</p>
    `,
    rec: `
      <p class="diag__rec-sub">What we recommend</p>
      <p class="diag__rec-lead">Gradually increase your weekly frequency and distribute your training volume better.</p>
      <p>An excellent strategy is an Upper / Lower split, which lets you train every muscle group with more frequency and quality.</p>
      <h4>Suggested structure</h4>
      <p class="diag__rec-sub">Monday — Upper</p>
      <ul>
        <li>Machine row (pronated grip)</li>
        <li>Machine row (supinated grip)</li>
        <li>Seated cable row (V-handle)</li>
        <li>Dumbbell shoulder press</li>
        <li>Lateral raise</li>
        <li>Triceps pushdown</li>
        <li>Hammer curl</li>
      </ul>
      <p class="diag__rec-sub">Tuesday — Lower</p>
      <ul>
        <li>Seated leg curl</li>
        <li>Hip thrust</li>
        <li>Leg press</li>
        <li>Lying leg curl</li>
        <li>Leg extension</li>
        <li>Hip adduction</li>
      </ul>
      <p class="diag__rec-sub">Wednesday — Cardio</p>
      <p>Aim to accumulate at least 120 minutes of cardio per week. You can split this time however fits best into your routine — shorter sessions across the week or longer workouts on specific days. During cardio, keep a moderate intensity, with your heart rate above roughly 115 bpm (this can vary with your age and conditioning).</p>
      <p class="diag__rec-sub">Thursday</p>
      <p>Repeat Upper.</p>
      <p class="diag__rec-sub">Friday</p>
      <p>Repeat Lower.</p>
      <p class="diag__rec-sub">Suggested volume</p>
      <p>Aim to accumulate 10 to 15 weekly sets per muscle group, spread across the week.</p>
      <p class="diag__rec-sub">How to progress</p>
      <p>Start by tracking the loads of your main exercises. Even small weekly improvements are an excellent sign of progress.</p>
      <p class="diag__rec-foot">This is a general structure. Depending on your routine, limitations and experience, individualized adjustments can significantly speed up your results.</p>
    `,
  },
  evolucao_hiper: {
    title: "You train, but don't progress",
    profile: `
      <p>You already have a solid training habit.</p>
      <p>Your next level of results depends less on training more and much more on the quality of the stimulus you apply.</p>
    `,
    rec: `
      <p class="diag__rec-sub">What this means</p>
      <p>When frequency and consistency are already in place, results usually come down to details like:</p>
      <ul>
        <li>Load progression</li>
        <li>Intensity</li>
        <li>Exercise selection</li>
        <li>Recovery</li>
        <li>Nutrition</li>
      </ul>
      <p class="diag__rec-sub">What we recommend</p>
      <p class="diag__rec-lead">Before adding even more training volume, optimize what you already do.</p>
      <p class="diag__rec-sub">How to apply double progression</p>
      <p>Choose a rep range — for example, 8 to 12 reps.</p>
      <p>Example of progression:</p>
      <ul>
        <li>Week 1 — 60 kg × 8</li>
        <li>Week 2 — 60 kg × 9</li>
        <li>Week 3 — 60 kg × 10</li>
        <li>Week 4 — 60 kg × 12</li>
        <li>Week 5 — 65 kg × 8</li>
      </ul>
      <p>This process lets you keep progressing without losing quality.</p>
      <p class="diag__rec-sub">Intensity</p>
      <p>Try to finish most of your sets very close to muscle failure, always keeping good technique. Training hard is one of the most important factors for building muscle.</p>
      <p class="diag__rec-sub">Cardio</p>
      <p>Aim to accumulate at least 120 minutes of cardio per week. You can split this time however fits best into your routine — shorter sessions across the week or longer workouts on specific days. During cardio, keep a moderate intensity, with your heart rate above roughly 115 bpm (this can vary with your age and conditioning).</p>
      <p class="diag__rec-sub">Other important factors</p>
      <p>It's also worth reviewing:</p>
      <ul>
        <li>Nutrition</li>
        <li>Sleep</li>
        <li>Hydration</li>
        <li>Recovery</li>
      </ul>
      <p>These factors can limit your results even when your training is well structured.</p>
      <p class="diag__rec-foot">When you're already doing almost everything right, results usually come down to individualized adjustments.</p>
    `,
  },
  constancia: {
    title: "Low consistency",
    profile: `
      <p>Your main challenge today is not finding the perfect training plan.</p>
      <p>The biggest challenge is keeping a consistent routine.</p>
    `,
    rec: `
      <p class="diag__rec-sub">What this means</p>
      <p>Before thinking about advanced strategies, it's important to build a sustainable routine. Consistency will always matter more than a perfect workout done only occasionally.</p>
      <p class="diag__rec-sub">What we recommend</p>
      <p class="diag__rec-lead">Start by simplifying your routine.</p>
      <p>An excellent strategy is a Full Body workout three times a week.</p>
      <h4>Suggested structure</h4>
      <p>In each workout, try to include the following exercises:</p>
      <ul>
        <li>Seated leg curl</li>
        <li>Leg press</li>
        <li>Leg extension</li>
        <li>Row</li>
        <li>Shoulder press</li>
        <li>Triceps pushdown</li>
      </ul>
      <p>In the following workouts, alternate some exercises, adding one more hamstring exercise and gradually increasing that muscle group's weekly volume.</p>
      <p class="diag__rec-sub">Suggested parameters</p>
      <ul>
        <li>2 to 3 sets per exercise</li>
        <li>8 to 12 reps</li>
      </ul>
      <p class="diag__rec-sub">Cardio</p>
      <p>Aim to accumulate at least 150 minutes of cardio per week. You can split this time however fits best into your routine — shorter sessions across the week or longer workouts on specific days. During cardio, keep a moderate intensity, with your heart rate above 115 bpm (this can vary with your age and conditioning). Also, try to stay active throughout the day. Walking more, taking the stairs and reducing your sitting time are simple strategies that increase your daily energy expenditure and help build a more consistent routine.</p>
      <p class="diag__rec-sub">Daily activity</p>
      <p>Beyond your workouts, try to stay active. Small changes make a difference:</p>
      <ul>
        <li>Walk more</li>
        <li>Take the stairs</li>
        <li>Go for walks in the park</li>
        <li>Reduce sitting time</li>
      </ul>
      <p class="diag__rec-foot">The best training plan is the one you can stick to for months.</p>
    `,
  },
  gasto: {
    title: "Insufficient energy expenditure",
    profile: `
      <p>You already keep a good strength-training frequency.</p>
      <p>Now the main adjustment is to increase your weekly energy expenditure.</p>
    `,
    rec: `
      <p class="diag__rec-sub">What this means</p>
      <p>Your body has probably adapted to your current level of physical activity. Increasing your weekly energy expenditure can significantly speed up weight loss.</p>
      <p class="diag__rec-sub">What we recommend</p>
      <p class="diag__rec-lead">Keep a Full Body workout three times a week.</p>
      <h4>Suggested structure</h4>
      <p>In each workout, try to include the following exercises:</p>
      <ul>
        <li>Seated leg curl</li>
        <li>Leg press</li>
        <li>Leg extension</li>
        <li>Row</li>
        <li>Shoulder press</li>
        <li>Triceps pushdown</li>
      </ul>
      <p>In the following workouts, alternate some exercises, adding one more hamstring exercise and gradually increasing that muscle group's weekly volume.</p>
      <p class="diag__rec-sub">Suggested parameters</p>
      <ul>
        <li>2 to 3 sets per exercise</li>
        <li>8 to 12 reps</li>
      </ul>
      <p class="diag__rec-sub">Cardio</p>
      <p>Aim to accumulate at least 180 minutes of cardio per week.</p>
      <p class="diag__rec-sub">Train heavy</p>
      <p>Even while losing weight, keep prioritizing strength training. Track your loads and aim to progress consistently.</p>
      <p class="diag__rec-sub">How to apply double progression</p>
      <p>Use a rep range — for example, 8–12. When you reach 12 reps with good technique, increase the load and go back to 8.</p>
      <p class="diag__rec-sub">Intensity</p>
      <p>Train close to muscle failure. This helps preserve muscle mass during weight loss.</p>
    `,
  },
  evolucao_emag: {
    title: "You train, but don't progress",
    profile: `
      <p>You've already built important habits.</p>
      <p>Now your progress depends mainly on strategic adjustments.</p>
    `,
    rec: `
      <p class="diag__rec-sub">What this means</p>
      <p>Your activity level is already good. At this point, simply training more is unlikely to be the answer — the focus should be on the quality of the stimulus.</p>
      <p class="diag__rec-sub">What we recommend</p>
      <p class="diag__rec-lead">Switch to an Upper / Lower split to raise the quality of your strength training.</p>
      <h4>Suggested structure</h4>
      <p class="diag__rec-sub">Upper</p>
      <ul>
        <li>Machine row (pronated grip)</li>
        <li>Machine row (supinated grip)</li>
        <li>Seated cable row (V-handle)</li>
        <li>Dumbbell shoulder press</li>
        <li>Lateral raise</li>
        <li>Triceps pushdown</li>
        <li>Hammer curl</li>
      </ul>
      <p class="diag__rec-sub">Lower</p>
      <ul>
        <li>Seated leg curl</li>
        <li>Lying leg curl</li>
        <li>Leg press</li>
        <li>Leg extension</li>
        <li>Hip adduction</li>
        <li>Hip thrust</li>
      </ul>
      <p class="diag__rec-sub">How to apply double progression</p>
      <p>Use a rep range between 8 and 12. When you reach the top of the range, increase the load and restart the progression.</p>
      <p class="diag__rec-sub">Intensity</p>
      <p>Finish your sets close to muscle failure.</p>
      <p class="diag__rec-sub">Cardio</p>
      <p>Even though your focus now is optimizing the quality of your strength training, keeping a good volume of cardio remains essential for weight loss. Aim to accumulate at least 180 minutes of cardio per week, at a moderate intensity, with your heart rate above roughly 115 bpm (this can vary with your age and conditioning).</p>
      <p class="diag__rec-sub">Also worth reviewing</p>
      <ul>
        <li>Nutrition</li>
        <li>Sleep</li>
        <li>Hydration</li>
        <li>Recovery</li>
      </ul>
      <p class="diag__rec-foot">These factors usually make a big difference for anyone who already has a solid training routine.</p>
    `,
  },
};

// Diagnóstico no idioma atual (fotos sempre do DIAGNOSES; e-mail continua em PT)
function getDiag(key) {
  if (window.i18n && window.i18n.getLang() === "en" && DIAGNOSES_EN[key]) {
    return Object.assign({}, DIAGNOSES[key], DIAGNOSES_EN[key]);
  }
  return DIAGNOSES[key];
}

// A Pergunta 1 (objetivo) define o conjunto de diagnósticos avaliado.
// Cada resposta soma pontos; o maior score vence (empate → ordem de listagem).
function computeDiagnosis(v) {
  if (v("objetivo") === "Emagrecimento") return diagnoseEmagrecimento(v);
  return diagnoseHipertrofia(v);
}

function pickMax(cands, scores) {
  let best = cands[0];
  for (const c of cands) if (c.score > best.score) best = c; // empate mantém o 1º (prioridade)
  return { key: best.key, scores };
}

// Objetivo: Hipertrofia e definição → Estímulo insuficiente (ei) vs. Treina mas não evolui (tne)
function diagnoseHipertrofia(v) {
  let ei = 0, tne = 0;

  switch (v("dias")) {
    case "3 dias": ei += 4; break;
    case "4 dias": ei += 2; tne += 1; break;
    case "5 dias": tne += 2; break;
    case "6 dias": tne += 3; break;
    case "7 dias": tne += 3; break;
  }
  switch (v("tempo")) {
    case "Menos de 6 meses": ei += 2; break;
    case "Entre 6 meses e 1 ano": ei += 1; break;
    case "Entre 1 e 2 anos": tne += 1; break;
    case "Mais de 2 anos": tne += 2; break;
  }
  switch (v("interrupcoes")) {
    case "Nenhuma": tne += 2; break;
    case "1 vez": ei += 1; break;
    case "2 vezes": ei += 3; break;
    case "3 vezes ou mais": ei += 4; break;
  }
  switch (v("dificuldade")) {
    case "Falta de tempo":
    case "Trabalho":
    case "Filhos/família":
    case "Falta de motivação": ei += 2; break;
    case "Não sei como organizar meu treino": ei += 1; tne += 1; break;
  }
  switch (v("estruturado")) {
    case "Sim, com acompanhamento profissional": tne += 2; break;
    case "Sim, mas monto sozinha": tne += 1; break;
    case "Uso treinos prontos da internet": ei += 2; break;
    case "Não tenho planejamento": ei += 3; break;
  }
  switch (v("registro")) {
    case "Sempre": tne += 3; break;
    case "Às vezes": tne += 1; ei += 1; break;
    case "Nunca": ei += 3; break;
  }
  switch (v("aerobico")) {
    case "Nenhum": ei += 1; break;
    case "Menos de 60 minutos": ei += 1; break;
    // "Entre 60 e 120 minutos" e "Mais de 120 minutos": 0
  }
  switch (v("satisfacao")) {
    case "Muito satisfeita": tne += 1; break;
    case "Parcialmente satisfeita": tne += 2; break;
    case "Insatisfeita": ei += 2; break;
  }

  return pickMax(
    [{ key: "estimulo", score: ei }, { key: "evolucao_hiper", score: tne }],
    { estimulo: ei, evolucao: tne }
  );
}

// Objetivo: Emagrecimento → Baixa constância (bc) vs. Gasto energético insuf. (gei) vs. Treina mas não evolui (tne)
// OBS: pesos propostos (o doc do Renan definiu só os "maiores pesos"/drivers,
// não os números exatos). Revisar/ajustar conforme necessário.
function diagnoseEmagrecimento(v) {
  let bc = 0, gei = 0, tne = 0;

  // Alta frequência (6-7 dias) é incompatível com "Baixa constância":
  // além de reforçar os outros perfis, exclui BC da disputa.
  const altaFrequencia = v("dias") === "6 dias" || v("dias") === "7 dias";

  switch (v("dias")) {
    case "3 dias": bc += 3; break;
    case "4 dias": bc += 1; break;
    case "5 dias": gei += 1; tne += 1; break;
    case "6 dias": gei += 3; tne += 2; break;
    case "7 dias": gei += 3; tne += 2; break;
  }
  switch (v("tempo")) {
    case "Menos de 6 meses": bc += 1; break;
    case "Entre 6 meses e 1 ano": break;
    case "Entre 1 e 2 anos": tne += 1; break;
    case "Mais de 2 anos": tne += 2; break;
  }
  switch (v("interrupcoes")) {
    case "Nenhuma": gei += 2; tne += 2; break;
    case "1 vez": gei += 1; tne += 1; break;
    case "2 vezes": bc += 3; break;
    case "3 vezes ou mais": bc += 4; break;
  }
  switch (v("dificuldade")) {
    case "Falta de tempo":
    case "Trabalho":
    case "Filhos/família":
    case "Falta de motivação": bc += 2; break;
    case "Não sei como organizar meu treino": bc += 1; break;
  }
  switch (v("estruturado")) {
    case "Sim, com acompanhamento profissional": tne += 2; break;
    case "Sim, mas monto sozinha": tne += 1; break;
    case "Uso treinos prontos da internet": bc += 1; break;
    case "Não tenho planejamento": bc += 3; break;
  }
  switch (v("registro")) {
    case "Sempre": tne += 2; break;
    case "Às vezes": tne += 1; break;
    case "Nunca": bc += 1; break;
  }
  switch (v("aerobico")) {
    case "Nenhum": gei += 3; break;
    case "Menos de 60 minutos": gei += 2; break;
    case "Entre 60 e 120 minutos": gei += 1; break;
    case "Mais de 120 minutos": tne += 2; break;
  }
  switch (v("satisfacao")) {
    case "Muito satisfeita": break;
    case "Parcialmente satisfeita": tne += 1; break;
    case "Insatisfeita": tne += 2; break;
  }

  const candidatos = [
    { key: "constancia", score: bc },
    { key: "gasto", score: gei },
    { key: "evolucao_emag", score: tne },
  ];
  // Com 6-7 dias de treino, "Baixa constância" nunca pode ser o diagnóstico.
  const elegiveis = altaFrequencia ? candidatos.filter((c) => c.key !== "constancia") : candidatos;

  return pickMax(elegiveis, { constancia: bc, gasto: gei, evolucao: tne });
}

/* ============================================================
   Navegação / etapas
   ============================================================ */
function showStep(i) {
  steps.forEach((s, idx) => s.classList.toggle("is-active", idx === i));
  steps[i].querySelector(".step-count").textContent =
    t("step_count", { i: i + 1, n: steps.length });

  btnPrev.style.visibility = i === 0 ? "hidden" : "visible";
  const isLast = i === steps.length - 1;
  btnNext.style.display = isLast ? "none" : "inline-flex";
  btnSubmit.style.display = isLast ? "inline-flex" : "none";

  progressBar.style.width = `${((i + 1) / steps.length) * 100}%`;
  // Focus first field for keyboard users
  const firstInput = steps[i].querySelector("input, textarea, select");
  if (firstInput) firstInput.focus({ preventScroll: true });
}

/* ---------- Email ---------- */
function isValidEmail(value) {
  // Pragmatic check: something@something.tld
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

/* ---------- Validation ---------- */
function clearErrors(step) {
  step.querySelectorAll(".has-error").forEach((f) => f.classList.remove("has-error"));
}

function validateStep(step) {
  clearErrors(step);
  let valid = true;
  let firstInvalid = null;

  // Required text/number/email/textarea/select inputs (skip disabled — e.g. hidden location fields)
  step.querySelectorAll("input[required], textarea[required], select[required]").forEach((el) => {
    if (el.disabled) return;
    const empty = el.type === "checkbox" ? !el.checked : !el.value.trim();
    if (empty) {
      el.closest(".field").classList.add("has-error");
      valid = false;
      firstInvalid = firstInvalid || el;
    }
  });

  // Email format
  const email = step.querySelector('input[type="email"]');
  if (email && email.value.trim() && !isValidEmail(email.value.trim())) {
    const field = email.closest(".field");
    if (!field.classList.contains("has-error")) field.classList.add("has-error");
    valid = false;
    firstInvalid = firstInvalid || email;
  }

  // Required radio/checkbox groups
  step.querySelectorAll(".options[data-required]").forEach((group) => {
    const checked = group.querySelector("input:checked");
    if (!checked) {
      group.closest(".field").classList.add("has-error");
      valid = false;
      firstInvalid = firstInvalid || group;
    }
  });

  if (firstInvalid) firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
  return valid;
}

btnNext.addEventListener("click", () => {
  if (!validateStep(steps[current])) return;
  if (current < steps.length - 1) {
    current++;
    showStep(current);
  }
});

btnPrev.addEventListener("click", () => {
  if (current > 0) {
    current--;
    showStep(current);
  }
});

// Enter key advances (except inside textareas)
form.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
    e.preventDefault();
    if (current < steps.length - 1) btnNext.click();
    else btnSubmit.click();
  }
});

/* ============================================================
   Coleta de dados (para log e e-mail)
   ============================================================ */
// Lê o valor de um campo; Estado/Cidade vêm do controle ativo conforme o país.
function readValue(k) {
  const data = new FormData(form);
  const isBrasil = paisSelect ? paisSelect.value === "Brasil" : false;
  if (k === "estado") return isBrasil && estadoSelect ? estadoSelect.value : "";
  if (k === "cidade") {
    if (isBrasil && cidadeSelect) return cidadeSelect.value;
    return cidadeExInput ? cidadeExInput.value.trim() : "";
  }
  return (data.get(k) || "").toString().trim();
}

function collectData(diagKey, scores) {
  const pessoa = {};
  for (const key of Object.keys(CONTACT_LABELS)) pessoa[CONTACT_LABELS[key]] = readValue(key) || "—";
  const respostas = {};
  for (const key of Object.keys(QUESTION_LABELS)) respostas[QUESTION_LABELS[key]] = readValue(key) || "—";
  return { diagnostico: DIAGNOSES[diagKey].title, scores, pessoa, respostas };
}

/* ---------- Rastreabilidade no console ---------- */
function logLead(payload) {
  console.groupCollapsed("%c[Carraro] Diagnóstico concluído", "color:#9B1B30;font-weight:bold");
  console.log("Diagnóstico:", payload.diagnostico);
  console.log("Scores:", payload.scores);
  console.log("Dados pessoais:");
  console.table(payload.pessoa);
  console.log("Respostas do diagnóstico:");
  console.table(payload.respostas);
  console.groupEnd();
}

/* ---------- Envio de e-mail (Renan + closer) via EmailJS ----------
   Os destinatários (To = closer, Cc = Renan) são FIXOS no template do EmailJS,
   não passam pelo cliente. Aqui só vão os dados do lead. */
// TEMP (fase de testes): envio de e-mail desativado. Voltar para true para reativar.
const EMAIL_ENABLED = false;
const EMAILJS_PUBLIC_KEY = "scWfk5MKjN7Td35Rw";
const EMAILJS_SERVICE_ID = "service_sadmvso";
const EMAILJS_TEMPLATE_ID = "template_g2v75xm";

const EMAIL_MAX_RETRIES = 3;       // tentativas por envio
const PENDING_KEY = "carraro_pending_leads"; // fila local p/ leads que falharam

if (window.emailjs) emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

// Monta os parâmetros do template a partir do payload coletado
function emailParams(payload) {
  const conteudo = [
    `Diagnóstico: ${payload.diagnostico}`,
    "",
    "— Dados pessoais —",
    ...Object.entries(payload.pessoa).map(([k, v]) => `${k}: ${v}`),
    "",
    "— Respostas do diagnóstico —",
    ...Object.entries(payload.respostas).map(([k, v]) => `${k}: ${v}`),
  ].join("\n");
  return {
    nome: payload.pessoa["Nome"],
    idade: payload.pessoa["Idade"],
    email: payload.pessoa["E-mail"],
    whatsapp: payload.pessoa["WhatsApp"],
    instagram: payload.pessoa["Instagram"],
    pais: payload.pessoa["País"],
    estado: payload.pessoa["Estado"],
    cidade: payload.pessoa["Cidade"],
    diagnostico: payload.diagnostico,
    conteudo,
  };
}

// Envia com retry/backoff. Resolve true (enviado) ou false (falhou após N tentativas).
function trySend(params, attempt = 1) {
  return emailjs
    .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params)
    .then(() => {
      console.info("[Carraro] E-mail do lead enviado ✓");
      return true;
    })
    .catch((err) => {
      console.error(`[Carraro] Falha no e-mail (tentativa ${attempt}/${EMAIL_MAX_RETRIES}):`, err);
      if (attempt < EMAIL_MAX_RETRIES) {
        return new Promise((r) => setTimeout(r, attempt * 1500)).then(() => trySend(params, attempt + 1));
      }
      return false;
    });
}

/* ---------- Fila local de segurança (reenvio em visita futura) ---------- */
function readPending() {
  try { return JSON.parse(localStorage.getItem(PENDING_KEY) || "[]"); } catch (e) { return []; }
}
function writePending(list) {
  try { localStorage.setItem(PENDING_KEY, JSON.stringify(list)); } catch (e) {}
}
function queuePending(params) {
  const list = readPending();
  list.push({ params, ts: Date.now() });
  writePending(list);
  console.warn("[Carraro] Lead salvo localmente — será reenviado numa próxima visita.");
}
// Tenta reenviar leads que ficaram pendentes em sessões anteriores
function flushPending() {
  if (!EMAIL_ENABLED) return;
  if (!window.emailjs) return;
  const list = readPending();
  if (!list.length) return;
  console.info(`[Carraro] Reenviando ${list.length} lead(s) pendente(s)...`);
  (async () => {
    const remaining = [];
    for (const item of list) {
      const ok = await trySend(item.params);
      if (!ok) remaining.push(item);
    }
    writePending(remaining);
    if (!remaining.length) console.info("[Carraro] Pendências reenviadas ✓");
  })();
}

function sendLeadEmail(payload) {
  if (!EMAIL_ENABLED) {
    console.info("[Carraro] Envio de e-mail desativado (fase de testes) — não enviado.");
    return;
  }
  const params = emailParams(payload);
  if (!window.emailjs) {
    console.warn("[Carraro] EmailJS não carregou — lead salvo localmente.");
    queuePending(params);
    return;
  }
  trySend(params).then((ok) => { if (!ok) queuePending(params); });
}

/* ---------- Mensagem do WhatsApp (curta — a lead quer falar com a equipe) ---------- */
function buildWaMessage() {
  const nome = readValue("nome");
  return nome ? t("wa_msg_named", { nome }) : t("wa_msg_anon");
}

/* ============================================================
   Resultado / diagnóstico
   ============================================================ */
let lastDiagKey = null; // usado p/ re-renderizar o resultado ao trocar o idioma

function renderResult(diagKey) {
  lastDiagKey = diagKey;
  const d = getDiag(diagKey);
  document.getElementById("diagTitle").textContent = d.title;
  document.getElementById("diagProfile").innerHTML = d.profile;

  const cards = d.photos
    .map(
      (src) => `
        <figure class="diag__photo diag__card">
          <img src="${src}" alt="${t("photo_alt")}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
          <figcaption class="diag__photo-fallback">${t("photo_fallback")}</figcaption>
        </figure>`
    )
    .join("");
  const hint = d.photos.length > 1 ? `<p class="diag__deck-hint">${t("deck_hint")}</p>` : "";

  document.getElementById("diagRec").innerHTML = `
    <div class="diag__rec-grid">
      <div class="diag__rec-body">${d.rec}</div>
      <aside class="diag__rec-aside">
        <div class="diag__deck" data-count="${d.photos.length}">${cards}</div>
        ${hint}
      </aside>
    </div>`;

  setupDeck(document.querySelector("#diagRec .diag__deck"));
}

/* ---------- Baralho de fotos (clique = jogar a foto pra baixo do baralho) ---------- */
function setupDeck(deckEl) {
  if (!deckEl) return;
  const order = Array.from(deckEl.querySelectorAll(".diag__card")); // [topo ... fundo]

  const place = (card, depth, animate) => {
    card.style.transition = animate ? "" : "none";
    card.style.zIndex = String(100 - depth);
    card.style.opacity = String(Math.max(0, 1 - depth * 0.14));
    card.style.transform =
      `translate(${depth * 7}px, ${depth * 11}px) scale(${1 - depth * 0.05}) rotate(${depth * 1.6}deg)`;
    card.style.pointerEvents = depth === 0 ? "auto" : "none";
    card.style.cursor = depth === 0 ? "pointer" : "default";
  };

  const layout = (animate = true) => order.forEach((c, depth) => place(c, depth, animate));

  layout(false);
  if (order.length <= 1) return; // 1 foto: sem baralho/clique

  const THROW_MS = 400;
  let busy = false;
  const throwTop = () => {
    if (busy) return;
    busy = true;
    const top = order[0];
    top.style.transition = `transform ${THROW_MS}ms cubic-bezier(.4,0,.2,1), opacity ${THROW_MS}ms ease`;
    top.style.transform = "translate(0, 130%) scale(.9) rotate(-5deg)";
    top.style.opacity = "0";
    // Conclui por tempo (não depende de transitionend, que não dispara sem animação)
    setTimeout(() => {
      order.push(order.shift());            // topo vai pro fundo
      place(top, order.length - 1, false);  // reposiciona no fundo, ainda invisível
      void top.offsetWidth;                 // reflow
      layout(true);                         // anima todos pra cima; a foto reaparece no fundo
      setTimeout(() => { busy = false; }, THROW_MS + 40);
    }, THROW_MS);
  };
  deckEl.addEventListener("click", throwTop);
}

/* ============================================================
   Submit → calcula diagnóstico, registra, envia e-mail, mostra resultado
   ============================================================ */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validateStep(steps[current])) return;

  const data = new FormData(form);
  const v = (k) => (data.get(k) || "").toString().trim();
  const { key, scores } = computeDiagnosis(v);

  const payload = collectData(key, scores);
  logLead(payload);        // rastreabilidade no console
  sendLeadEmail(payload);  // e-mail pro Renan + closer (pendente de config)

  renderResult(key);

  // WhatsApp leva apenas uma mensagem curta de interesse (sem as respostas)
  waLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWaMessage())}`;

  // Mostra a tela de resultado
  steps.forEach((s) => s.classList.remove("is-active"));
  formNav.style.display = "none";
  progressBar.style.width = "100%";
  doneScreen.classList.add("is-active");
  doneScreen.scrollIntoView({ behavior: "smooth", block: "start" });
});

/* ============================================================
   País / Estado / Cidade
   ============================================================ */
const paisSelect = document.getElementById("pais");
const estadoSelect = document.getElementById("estado");
const cidadeSelect = document.getElementById("cidade");
const cidadeExInput = document.getElementById("cidadeEx");
const fieldEstado = document.getElementById("fieldEstado");
const fieldCidadeBr = document.getElementById("fieldCidadeBr");
const fieldCidadeEx = document.getElementById("fieldCidadeEx");

let cidadesPorEstado = null;

// Populate country dropdown (guard: o campo país pode estar desativado na fase de testes)
if (paisSelect) fetch("assets/data/paises.json")
  .then((r) => r.json())
  .then((paises) => {
    const frag = document.createDocumentFragment();
    paises.forEach((nome) => {
      const opt = document.createElement("option");
      opt.value = nome;
      opt.textContent = nome;
      frag.appendChild(opt);
    });
    paisSelect.appendChild(frag);
  })
  .catch(() => {
    // Fallback so the form still works if the list fails to load
    paisSelect.insertAdjacentHTML("beforeend", '<option value="Brasil">Brasil</option><option value="Outro">Outro</option>');
  });

// Lazy-load Brazilian states + cities the first time Brazil is selected
let brDataLoaded = false;
function loadBrData() {
  if (brDataLoaded) return;
  brDataLoaded = true;
  Promise.all([
    fetch("assets/data/estados.json").then((r) => r.json()),
    fetch("assets/data/cidades-por-estado.json").then((r) => r.json()),
  ])
    .then(([estados, cidades]) => {
      cidadesPorEstado = cidades;
      const frag = document.createDocumentFragment();
      estados.forEach((e) => {
        const opt = document.createElement("option");
        opt.value = e.uf;
        opt.textContent = `${e.nome} (${e.uf})`;
        frag.appendChild(opt);
      });
      estadoSelect.appendChild(frag);
    })
    .catch(() => { brDataLoaded = false; });
}

// Fill the city dropdown with the cities of the selected state
function populateCidades(uf) {
  cidadeSelect.innerHTML = `<option value="" selected disabled>${t("select_ph")}</option>`;
  const lista = (cidadesPorEstado && cidadesPorEstado[uf]) || [];
  const frag = document.createDocumentFragment();
  lista.forEach((nome) => {
    const opt = document.createElement("option");
    opt.value = nome;
    opt.textContent = nome;
    frag.appendChild(opt);
  });
  cidadeSelect.appendChild(frag);
  cidadeSelect.disabled = lista.length === 0;
}

if (estadoSelect) estadoSelect.addEventListener("change", () => populateCidades(estadoSelect.value));

// Show Brazilian state/city dropdowns vs. free-text city for other countries.
// Disabled controls are skipped by validation and excluded from submission.
function updateLocationMode() {
  if (!paisSelect) return;
  const isBrasil = paisSelect.value === "Brasil";
  fieldEstado.style.display = isBrasil ? "" : "none";
  fieldCidadeBr.style.display = isBrasil ? "" : "none";
  fieldCidadeEx.style.display = isBrasil ? "none" : "";

  if (isBrasil) {
    loadBrData();
    estadoSelect.disabled = false;
    cidadeSelect.disabled = !estadoSelect.value; // enabled once a state is chosen
    cidadeExInput.disabled = true;
  } else {
    estadoSelect.disabled = true;
    cidadeSelect.disabled = true;
    cidadeExInput.disabled = false;
  }
}
if (paisSelect) paisSelect.addEventListener("change", updateLocationMode);

// Rastreabilidade: loga cada escolha de resposta no console
form.querySelectorAll('input[type="radio"]').forEach((r) => {
  r.addEventListener("change", () => {
    if (r.checked) console.debug(`[Carraro] ${r.name} = "${r.value}"`);
  });
});

// Troca de idioma sem recarregar: atualiza contador da etapa e,
// se o resultado estiver na tela, re-renderiza o diagnóstico e o link do WhatsApp
document.addEventListener("langchange", () => {
  if (doneScreen.classList.contains("is-active") && lastDiagKey) {
    renderResult(lastDiagKey);
    waLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWaMessage())}`;
  } else {
    showStep(current);
  }
});

// Init
updateLocationMode();
showStep(0);
flushPending(); // reenvia leads que ficaram pendentes em visitas anteriores
