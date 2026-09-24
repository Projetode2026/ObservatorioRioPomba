import React from 'react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#dbe4dd] pb-4 sm:pb-6">
        <span className="font-mono text-xs text-[#125575] uppercase tracking-wider font-semibold block">
          Documentação
        </span>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#0e2b1c] mt-1 sm:mt-2">
          Sobre o projeto
        </h2>
        <p className="text-sm sm:text-[15.5px] text-[#48584f] mt-1.5 sm:mt-2 max-w-3xl leading-relaxed">
          O que este observatório se propõe a fazer, como o trabalho é conduzido e onde ele pode chegar.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
        {/* Left Column */}
        <div className="space-y-8">
          <div className="space-y-2">
            <h4 className="font-mono text-xs text-[#125575] uppercase tracking-wider font-semibold">
              Objetivo
            </h4>
            <p className="text-[14.8px] text-[#48584f] leading-relaxed">
              Acompanhar de forma contínua a qualidade físico-química da água do Rio Pomba e comunicar, de maneira acessível, a relação entre essas condições e a biodiversidade aquática associada à Mata Atlântica na região.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-mono text-xs text-[#125575] uppercase tracking-wider font-semibold">
              Área de estudo
            </h4>
            <p className="text-[14.8px] text-[#48584f] leading-relaxed">
              Um trecho do Rio Pomba na Zona da Mata de Minas Gerais, abrangendo áreas com diferentes graus de conservação da vegetação ripária, da mais preservada até trechos urbanos.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-mono text-xs text-[#125575] uppercase tracking-wider font-semibold">
              Metodologia
            </h4>
            <p className="text-[14.8px] text-[#48584f] leading-relaxed">
              Coletas periódicas de parâmetros físico-químicos (pH, temperatura, oxigênio dissolvido, turbidez, condutividade elétrica, nitrogênio e fósforo) em pontos fixos, com registro histórico para análise de tendências ao longo do tempo. A estrutura da plataforma foi pensada para receber dados reais assim que estiverem disponíveis, substituindo os valores demonstrativos atuais.
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <div className="space-y-2.5">
            <h4 className="font-mono text-xs text-[#125575] uppercase tracking-wider font-semibold">
              Pontos de monitoramento
            </h4>
            <ul className="space-y-2.5 text-[14.3px] text-[#48584f]">
              <li className="flex gap-2.5 items-start">
                <span className="font-mono font-semibold text-[#164a2f] shrink-0 mt-0.5">01</span>
                <span>
                  <strong className="text-[#0e2b1c]">Ponte de Camargo</strong> — trecho de referência, com maior cobertura de mata ciliar.
                </span>
              </li>
              <li className="flex gap-2.5 items-start">
                <span className="font-mono font-semibold text-[#164a2f] shrink-0 mt-0.5">02</span>
                <span>
                  <strong className="text-[#0e2b1c]">Balneário Municipal</strong> — ponto intermediário, de uso recreativo.
                </span>
              </li>
              <li className="flex gap-2.5 items-start">
                <span className="font-mono font-semibold text-[#164a2f] shrink-0 mt-0.5">03</span>
                <span>
                  <strong className="text-[#0e2b1c]">Ponte da Empa / Bairro São Vicente</strong> — trecho urbano, mais próximo de áreas de maior ocupação.
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-mono text-xs text-[#125575] uppercase tracking-wider font-semibold">
              Importância do Rio Pomba
            </h4>
            <p className="text-[14.8px] text-[#48584f] leading-relaxed">
              Além de abastecer comunidades ao longo de seu curso, o rio sustenta ecossistemas aquáticos e ripários que fazem parte do bioma Mata Atlântica, um dos mais ameaçados e biodiversos do planeta.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-mono text-xs text-[#125575] uppercase tracking-wider font-semibold">
              Urbanização, mata ciliar e qualidade da água
            </h4>
            <p className="text-[14.8px] text-[#48584f] leading-relaxed">
              A vegetação ao longo das margens funciona como filtro natural, retendo sedimentos e nutrientes antes que cheguem ao rio. Onde essa vegetação é reduzida — geralmente em áreas mais urbanizadas — tende-se a observar maior turbidez, maior concentração de nutrientes e menor diversidade de espécies aquáticas, refletindo diretamente no que é medido nos pontos de coleta.
            </p>
          </div>
        </div>
      </div>

      {/* Institutional Placeholder Box */}
      <div className="space-y-2 pt-2 border-t border-[#dbe4dd]">
        <h4 className="font-mono text-xs text-[#125575] uppercase tracking-wider font-semibold">
          Pesquisadores, instituição e parceiros
        </h4>
        <div className="border border-dashed border-[#dbe4dd] rounded-xl p-5 text-sm text-[#7c8d83] bg-[#fbfcfa] leading-relaxed">
          Espaço reservado para informações sobre a equipe de pesquisa, instituição responsável, parceiros institucionais e referências científicas utilizadas no projeto. Este conteúdo será adicionado nas próximas atualizações da plataforma.
        </div>
      </div>
    </div>
  );
};
