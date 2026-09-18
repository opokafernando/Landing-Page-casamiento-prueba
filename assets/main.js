  // ============================================================
  // I18N: diccionario de textos (Português-Brasil / Español-Argentina /
  // English-US) + helper t(key, vars) + applyLanguage(lang).
  // Se declara primero porque el resto del código (carrusel, elección,
  // paquetes, whatsapp) lo usa para armar textos dinámicos.
  // ============================================================
  var currentLang = 'es';

  var LANG = {
    es: {
      'lang.switcher': '🌐 Idioma',
      'hero.imgAlt': 'Novios abrazados durante su casamiento, fotografía de Fernando Opoka',
      'hero.eyebrow': 'Fotografía de casamiento con alma',
      'hero.h1': '¿De verdad quieres contratar al fotógrafo más barato el día de tu casamiento?',
      'hero.sub': 'Tu boda no se repite. Las fotos que la cuenten, tampoco deberían ser cualquier cosa.',
      'hero.btn1': '¿Cuánto cuesta?',
      'hero.btn2': 'Quiero agendar una reunión',
      'hero.btn3': '¿Cómo es el método?',
      'hero.microcopy': 'Sin compromiso. Te respondo en menos de 8h.',
      'vsl.placeholder': 'Espacio reservado para tu VSL',
      'problema.imgAlt': 'Detalle emotivo de la ceremonia de boda',
      'problema.eyebrow': 'El problema',
      'problema.h2': 'Buscas algo más que fotos bonitas',
      'problema.p1': 'Quieres confiar en tu fotógrafo: en la calidad de su trabajo, en su calidez, su educación y su amabilidad el día más importante de tu vida.',
      'problema.p2': 'Busco hacerte fotos inolvidables, enfocadas en las emociones tuyas, de tu pareja y de las personas que más quieren.',
      'problema.p3': 'Por eso, antes de tu boda, nos reunimos: quiero conocer tus gustos y tu estilo antes de tomar la cámara.',
      'proceso.eyebrow': 'Cómo trabajamos',
      'proceso.h2': 'Un proceso pensado para que disfrutes tu día',
      'proceso.step1.num': 'Antes',
      'proceso.step1.h3': 'Nos conocemos',
      'proceso.step1.p': 'Reunión previa para hablar de tu historia, tus gustos y el estilo de fotos que quieres conservar para siempre, con asesoramiento de imagen incluido.',
      'proceso.step2.num': 'El gran día',
      'proceso.step2.h3': 'Cobertura completa',
      'proceso.step2.p': 'Making of, ceremonia y fiesta, con cobertura personalizada a cargo de 2 fotógrafos siempre atentos a los momentos reales y espontáneos.',
      'proceso.step3.num': 'Después',
      'proceso.step3.h3': 'Entrega sin esperas',
      'proceso.step3.p': 'Galería digital completa, sin límites, en 7 días. Según tu paquete, también hay opción de entrega inmediata de fotos la misma noche y álbumes impresos.',
      'promesa.eyebrow': 'Lo que está en juego',
      'promesa.h2': 'Contratar al más barato puede costarte mucho más que dinero',
      'promesa.p': 'Elegir por precio puede costarte los recuerdos que después no vas a poder recuperar. Nadie va a preocuparse por tu boda como yo.',
      'portafolio.eyebrow': 'Portafolio',
      'portafolio.h2': 'Momentos auténticos',
      'portafolio.alt1': 'Fotografía de boda 1', 'portafolio.alt2': 'Fotografía de boda 2',
      'portafolio.alt3': 'Fotografía de boda 3', 'portafolio.alt4': 'Fotografía de boda 4',
      'portafolio.alt5': 'Fotografía de boda 5', 'portafolio.alt6': 'Fotografía de boda 6',
      'portafolio.alt7': 'Fotografía de boda 7', 'portafolio.alt8': 'Fotografía de boda 8',
      'portafolio.alt9': 'Fotografía de boda 9', 'portafolio.alt10': 'Fotografía de boda 10',
      'portafolio.alt11': 'Fotografía de boda 11', 'portafolio.alt12': 'Fotografía de boda 12',
      'portafolio.alt13': 'Fotografía de boda 13', 'portafolio.alt14': 'Fotografía de boda 14',
      'portafolio.alt15': 'Fotografía de boda 15', 'portafolio.alt16': 'Fotografía de boda 16',
      'portafolio.alt17': 'Fotografía de boda 17', 'portafolio.alt18': 'Fotografía de boda 18',
      'portafolio.alt19': 'Fotografía de boda 19', 'portafolio.alt20': 'Fotografía de boda 20',
      'portafolio.alt21': 'Fotografía de boda 21', 'portafolio.alt22': 'Fotografía de boda 22',
      'sobre.imgAlt': 'Fernando Opoka, fotógrafo de bodas',
      'sobre.eyebrow': 'Sobre mí',
      'sobre.p1': 'Llevo 9 años fotografiando bodas para parejas que quieren algo más que fotos básicas: quieren que alguien se preocupe genuinamente por su historia.',
      'sobre.p2': 'Trabajo con calidez, cercanía y con la certeza de que cada boda merece que alguien la mire con atención y respeto.',
      'sobre.credit': 'Fotógrafo profesional de bodas',
      'paquetes.eyebrow': 'Paquetes',
      'paquetes.h2': 'Elegí cómo quieres vivir tu día',
      'pkg.mini.eyebrow': 'Paquete 1',
      'pkg.mini.li1': 'Hasta 6 horas de cobertura',
      'pkg.choice.preboda': 'Ensayo pre boda: 25 fotos',
      'pkg.choice.makingof': 'Making of',
      'pkg.mini.li2': 'Cobertura hecha por 2 fotógrafos',
      'pkg.mini.li3': 'Entrega en un plazo de 7 días',
      'pkg.mini.li4': 'Más de 300 fotos del día de la boda',
      'pkg.mini.li5': 'Galería online para descargar y compartir tus fotos',
      'pkg.mini.li6': 'Invitación digital de regalo',
      'pkg.mini.li7': 'Asesoramiento de imagen',
      'pkg.mini.li8': 'Fotos editadas la misma noche de la boda',
      'pkg.mini.li9': 'Álbum impreso de 25x25, regalo de 20 páginas',
      'pkg.mini.priceNote': 'Hasta 6 cuotas sin interés con tarjeta (6x de R$ 510)',
      'pkg.mini.priceSave': '💚 Pagando con Pix: R$ 2.600 (ahorrás R$ 460)',
      'pkg.btn': 'Quiero este paquete',
      'pkg.plus.badge': 'Regalo: álbum 25x25 de 20 páginas (el de 30 páginas, con 15% off)',
      'pkg.plus.eyebrow': 'Paquete 2 · el más elegido',
      'pkg.plus.li1': 'Hasta 8 horas de cobertura',
      'pkg.plus.li2': 'Ensayo pre boda: 50 fotos + 1 video de 20 segundos',
      'pkg.plus.li3': 'Más de 450 fotos del día de la boda',
      'pkg.plus.li4': '10 fotos editadas la misma noche de la boda',
      'pkg.plus.li5': 'Álbum impreso de 25x25, 20 páginas de regalo (o 30 páginas con 15% off)',
      'pkg.plus.priceNote': 'Hasta 6 cuotas sin interés con tarjeta (6x de R$ 941,67)',
      'pkg.plus.priceSave': '💚 Pagando con Pix: R$ 4.800 (ahorrás R$ 850)',
      'pkg.full.badge': 'Regalo: álbum 25x25 de 20 páginas (el de 30 páginas, con 50% off)',
      'pkg.full.eyebrow': 'Paquete 3',
      'pkg.full.li1': 'Hasta 10 horas de cobertura',
      'pkg.full.li2': 'Ensayo pre boda: 80 fotos + 2 videos de 20 segundos',
      'pkg.full.li3': 'Más de 600 fotos del día de la boda',
      'pkg.full.li4': '25 fotos editadas la misma noche de la boda',
      'pkg.full.li5': 'Álbum impreso de 25x25, 20 páginas de regalo (o 30 páginas con 50% off)',
      'pkg.full.priceNote': 'Hasta 6 cuotas sin interés con tarjeta (6x de R$ 1.216,67)',
      'pkg.full.priceSave': '💚 Pagando con Pix: R$ 6.200 (ahorrás R$ 1.100)',
      'extras.eyebrow': '¿Le sumamos un álbum?',
      'extras.h2': 'Sumá un álbum extra a tu paquete',
      'extras.sub': 'Elegí el tamaño de álbum 25x25 que quieras agregar a tu presupuesto.',
      'extras.giftRibbon': '🎁 FREE',
      'extras.discountBadge': '15%<br>OFF',
      'extras.discountBadge50': '50%<br>OFF',
      'extras.chipTitle': 'Álbum de 25x25',
      'extras.chip20Sub': '20 páginas',
      'extras.chip30Sub': '30 páginas',
      'extras.chip40Sub': '40 páginas',
      'extras.chipMayorTitle': 'Álbum de Mayor tamaño',
      'extras.chipMayorSub': 'Más de 40 páginas',
      'extras.continueBtn': 'Continuar con mi consulta',
      'extras.travelNotice': '📍 Los valores pueden aumentar para desplazamientos mayores a 20 km de Balneário Camboriú.',
      'budget.empty': 'Elegí un paquete arriba para ver tu presupuesto acá.',
      'budget.subtotalLabel': 'Subtotal',
      'budget.closePopup': 'Cerrar',
      'budget.installmentsLine': '6x de {amount} sin interés',
      'budget.depositLine': 'Entrega del 30%: {amount}',
      'budget.albumLabel': 'Álbum 25x25',
      'budget.albumLabelWith': 'Álbum 25x25, {album}',
      'budget.free': 'Incluido, gratis',
      'budget.consult': 'Consultar',
      'budget.noAlbum': 'Sin álbum',
      'spotlight.hint': 'Elige una opción para continuar',
      'custom.text': '¿Ninguno se ajusta del todo? También armamos un paquete personalizado a tu medida.',
      'custom.link': 'Contame qué necesitás',
      'payment.eyebrow': 'Cómo pagar',
      'payment.h2': 'Elegí tu método de pago',
      'payment.cardTitle1': 'Tarjeta de crédito',
      'payment.cardSub1': 'Cuotas más livianas: hasta 6 sin interés',
      'payment.badge': 'Más conveniente',
      'payment.cardTitle2': 'Pix',
      'payment.cardSub2': 'Pagá con Pix y ganá un 15% de descuento en todo',
      'payment.pixTerms': 'Señal del 30% para reservar la fecha (solo para pago en Pix); el resto hasta 30 días antes de la boda.',
      'payment.toggleCardFull': 'Tarjeta de crédito',
      'payment.toggleCardShort': 'Tarjeta',
      'payment.togglePix': 'Pix',
      'extras.pixPrice': 'Pix: {price}',
      'extras.pixPrice20': 'Pix: R$ 1.300',
      'extras.pixPrice30': 'Pix: R$ 1.900',
      'extras.pixPrice40': 'Pix: R$ 2.200',
      'cta.eyebrow': 'Agenda tu fecha',
      'cta.h2': 'Conversemos sobre tu boda',
      'cta.intro': 'Contame un poco de ustedes y de tu boda. Si elegís una fecha y horario abajo, quedás agendado directo para una reunión conmigo; si preferís, también podés escribirme directo por WhatsApp. Te respondo en menos de 8 horas.',
      'cta.imgAlt': 'Novios el día de su boda',
      'cta.preferOther': 'Escribime directo por WhatsApp:',
      'cta.whatsappBtn': 'Agendar reunión por WhatsApp',
      'form.nombre': 'Tu nombre',
      'form.pareja': 'Nombre de tu pareja',
      'form.email': 'Correo electrónico',
      'form.fecha': 'Fecha y lugar de la boda',
      'form.fechaPlaceholder': 'Ej. 12 de octubre, Buenos Aires',
      'form.mensaje': 'Contanos un poco más',
      'form.submit': 'Enviar por WhatsApp',
      'form.microcopy': 'Sin compromiso. Respondo en menos de 8h.',
      'footer.socialsAria': 'Instagram de Fernando Opoka Fotografía',
      'footer.fine': '© 2026 Fernando Opoka Fotografía. Tus datos se usan únicamente para responder tu consulta.',
      'footer.privacyLink': 'Política de Privacidad',
      'footer.blogLink': 'Blog',
      'footer.resourcesLink': 'Recursos gratis',
      'lightbox.close': 'Cerrar imagen ampliada',
      'lightbox.ariaLabel': 'Ampliar foto',
      'wa.greetingName': 'Hola, soy {name}, ',
      'wa.greetingGeneric': 'Hola, ',
      'wa.wantsPkg': 'quiero consultar por el paquete {pkg}',
      'wa.withAlbum': ' con el álbum de {album}',
      'wa.generic': 'quiero consultar por tus paquetes de fotografía de bodas.',
      'wa.custom': 'no encontré un paquete que se ajuste del todo a lo que busco. ¿Podemos armar algo a mi medida? Te cuento un poco qué necesito: ',
      'wa.partner': 'Pareja: {partner}.',
      'wa.date': 'Fecha y lugar: {date}.',
      'wa.email': 'Mi correo: {email}.',
      'wa.extraMsg': 'Más info: {msg}'
    },
    pt: {
      'lang.switcher': '🌐 Idioma',
      'hero.imgAlt': 'Noivos abraçados durante o casamento, fotografia de Fernando Opoka',
      'hero.eyebrow': 'Fotografia de casamento com alma',
      'hero.h1': 'Você realmente quer contratar o fotógrafo mais barato no dia do seu casamento?',
      'hero.sub': 'Seu casamento não se repete. As fotos que vão contá-lo também não deveriam ser qualquer coisa.',
      'hero.btn1': 'Quanto custa?',
      'hero.btn2': 'Quero agendar uma reunião',
      'hero.btn3': 'Como funciona o método?',
      'hero.microcopy': 'Sem compromisso. Respondo em menos de 8h.',
      'vsl.placeholder': 'Espaço reservado para o seu VSL',
      'problema.imgAlt': 'Detalhe emocionante da cerimônia de casamento',
      'problema.eyebrow': 'O problema',
      'problema.h2': 'Você busca mais do que fotos bonitas',
      'problema.p1': 'Você quer confiar no seu fotógrafo: na qualidade do trabalho, na sua calidez, educação e gentileza no dia mais importante da sua vida.',
      'problema.p2': 'Busco fazer fotos inesquecíveis, focadas nas emoções de vocês e das pessoas que mais amam.',
      'problema.p3': 'Por isso, antes do casamento, nos encontramos: quero conhecer seus gostos e seu estilo antes de pegar a câmera.',
      'proceso.eyebrow': 'Como trabalhamos',
      'proceso.h2': 'Um processo pensado para você aproveitar o seu dia',
      'proceso.step1.num': 'Antes',
      'proceso.step1.h3': 'Nos conhecemos',
      'proceso.step1.p': 'Reunião prévia para falar da sua história, dos seus gostos e do estilo de fotos que você quer guardar para sempre, com consultoria de imagem incluída.',
      'proceso.step2.num': 'O grande dia',
      'proceso.step2.h3': 'Cobertura completa',
      'proceso.step2.p': 'Making of, cerimônia e festa, com cobertura personalizada de 2 fotógrafos sempre atentos aos momentos reais e espontâneos.',
      'proceso.step3.num': 'Depois',
      'proceso.step3.h3': 'Entrega sem demora',
      'proceso.step3.p': 'Galeria digital completa, sem limites, em 7 dias. Dependendo do seu pacote, também há opção de entrega imediata de fotos na mesma noite e álbuns impressos.',
      'promesa.eyebrow': 'O que está em jogo',
      'promesa.h2': 'Contratar o mais barato pode custar muito mais do que dinheiro',
      'promesa.p': 'Escolher pelo preço pode custar as lembranças que depois você não vai conseguir recuperar. Ninguém vai se importar com o seu casamento como eu.',
      'portafolio.eyebrow': 'Portfólio',
      'portafolio.h2': 'Momentos autênticos',
      'portafolio.alt1': 'Fotografia de casamento 1', 'portafolio.alt2': 'Fotografia de casamento 2',
      'portafolio.alt3': 'Fotografia de casamento 3', 'portafolio.alt4': 'Fotografia de casamento 4',
      'portafolio.alt5': 'Fotografia de casamento 5', 'portafolio.alt6': 'Fotografia de casamento 6',
      'portafolio.alt7': 'Fotografia de casamento 7', 'portafolio.alt8': 'Fotografia de casamento 8',
      'portafolio.alt9': 'Fotografia de casamento 9', 'portafolio.alt10': 'Fotografia de casamento 10',
      'portafolio.alt11': 'Fotografia de casamento 11', 'portafolio.alt12': 'Fotografia de casamento 12',
      'portafolio.alt13': 'Fotografia de casamento 13', 'portafolio.alt14': 'Fotografia de casamento 14',
      'portafolio.alt15': 'Fotografia de casamento 15', 'portafolio.alt16': 'Fotografia de casamento 16',
      'portafolio.alt17': 'Fotografia de casamento 17', 'portafolio.alt18': 'Fotografia de casamento 18',
      'portafolio.alt19': 'Fotografia de casamento 19', 'portafolio.alt20': 'Fotografia de casamento 20',
      'portafolio.alt21': 'Fotografia de casamento 21', 'portafolio.alt22': 'Fotografia de casamento 22',
      'sobre.imgAlt': 'Fernando Opoka, fotógrafo de casamentos',
      'sobre.eyebrow': 'Sobre mim',
      'sobre.p1': 'Há 9 anos fotografo casamentos para casais que querem mais do que fotos básicas: querem que alguém se importe genuinamente com a história deles.',
      'sobre.p2': 'Trabalho com calor humano, proximidade e a certeza de que cada casamento merece que alguém o olhe com atenção e respeito.',
      'sobre.credit': 'Fotógrafo profissional de casamentos',
      'paquetes.eyebrow': 'Pacotes',
      'paquetes.h2': 'Escolha como quer viver o seu dia',
      'pkg.mini.eyebrow': 'Pacote 1',
      'pkg.mini.li1': 'Até 6 horas de cobertura',
      'pkg.choice.preboda': 'Ensaio pré-casamento: 25 fotos',
      'pkg.choice.makingof': 'Making of',
      'pkg.mini.li2': 'Cobertura feita por 2 fotógrafos',
      'pkg.mini.li3': 'Entrega em até 7 dias',
      'pkg.mini.li4': 'Mais de 300 fotos do dia do casamento',
      'pkg.mini.li5': 'Galeria online para baixar e compartilhar suas fotos',
      'pkg.mini.li6': 'Convite digital de presente',
      'pkg.mini.li7': 'Consultoria de imagem',
      'pkg.mini.li8': 'Fotos editadas na mesma noite do casamento',
      'pkg.mini.li9': 'Álbum impresso 25x25, presente de 20 páginas',
      'pkg.mini.priceNote': 'Até 6x sem juros no cartão (6x de R$ 510)',
      'pkg.mini.priceSave': '💚 Pagando no Pix: R$ 2.600 (economize R$ 460)',
      'pkg.btn': 'Quero este pacote',
      'pkg.plus.badge': 'Presente: álbum 25x25 de 20 páginas (o de 30 páginas, com 15% off)',
      'pkg.plus.eyebrow': 'Pacote 2 · o mais escolhido',
      'pkg.plus.li1': 'Até 8 horas de cobertura',
      'pkg.plus.li2': 'Ensaio pré-casamento: 50 fotos + 1 vídeo de 20 segundos',
      'pkg.plus.li3': 'Mais de 450 fotos do dia do casamento',
      'pkg.plus.li4': '10 fotos editadas na mesma noite do casamento',
      'pkg.plus.li5': 'Álbum impresso 25x25, 20 páginas de presente (ou 30 páginas com 15% off)',
      'pkg.plus.priceNote': 'Até 6x sem juros no cartão (6x de R$ 941,67)',
      'pkg.plus.priceSave': '💚 Pagando no Pix: R$ 4.800 (economize R$ 850)',
      'pkg.full.badge': 'Presente: álbum 25x25 de 20 páginas (o 30 páginas com 50% off)',
      'pkg.full.eyebrow': 'Pacote 3',
      'pkg.full.li1': 'Até 10 horas de cobertura',
      'pkg.full.li2': 'Ensaio pré-casamento: 80 fotos + 2 vídeos de 20 segundos',
      'pkg.full.li3': 'Mais de 600 fotos do dia do casamento',
      'pkg.full.li4': '25 fotos editadas na mesma noite do casamento',
      'pkg.full.li5': 'Álbum impresso 25x25, 20 páginas de presente (ou 30 páginas com 50% off)',
      'pkg.full.priceNote': 'Até 6x sem juros no cartão (6x de R$ 1.216,67)',
      'pkg.full.priceSave': '💚 Pagando no Pix: R$ 6.200 (economize R$ 1.100)',
      'extras.eyebrow': 'Vamos incluir um álbum?',
      'extras.h2': 'Adicione um álbum extra ao seu pacote',
      'extras.sub': 'Escolha o tamanho do álbum 25x25 que você quer adicionar ao seu orçamento.',
      'extras.giftRibbon': '🎁 FREE',
      'extras.discountBadge': '15%<br>OFF',
      'extras.discountBadge50': '50%<br>OFF',
      'extras.chipTitle': 'Álbum de 25x25',
      'extras.chip20Sub': '20 páginas',
      'extras.chip30Sub': '30 páginas',
      'extras.chip40Sub': '40 páginas',
      'extras.chipMayorTitle': 'Álbum de tamanho maior',
      'extras.chipMayorSub': 'Mais de 40 páginas',
      'extras.continueBtn': 'Continuar com minha consulta',
      'extras.travelNotice': '📍 Os valores podem aumentar para deslocamentos maiores que 20 km de Balneário Camboriú.',
      'budget.empty': 'Escolha um pacote acima para ver seu orçamento aqui.',
      'budget.subtotalLabel': 'Subtotal',
      'budget.closePopup': 'Fechar',
      'budget.installmentsLine': '6x de {amount} sem juros',
      'budget.depositLine': 'Entrada de 30%: {amount}',
      'budget.albumLabel': 'Álbum 25x25',
      'budget.albumLabelWith': 'Álbum 25x25, {album}',
      'budget.free': 'Incluído, grátis',
      'budget.consult': 'Consultar',
      'budget.noAlbum': 'Sem álbum',
      'spotlight.hint': 'Escolha uma opção para continuar',
      'custom.text': 'Nenhum se encaixa totalmente? Também montamos um pacote personalizado sob medida.',
      'custom.link': 'Me conte o que você precisa',
      'payment.eyebrow': 'Como pagar',
      'payment.h2': 'Escolha sua forma de pagamento',
      'payment.cardTitle1': 'Cartão de crédito',
      'payment.cardSub1': 'Parcelas mais leves: até 6x sem juros',
      'payment.badge': 'Mais vantajoso',
      'payment.cardTitle2': 'Pix',
      'payment.cardSub2': 'Pague com Pix e ganhe 15% de desconto em tudo',
      'payment.pixTerms': 'Sinal de 30% para reservar a data (somente para pagamento via Pix); o restante até 30 dias antes do casamento.',
      'payment.toggleCardFull': 'Cartão de crédito',
      'payment.toggleCardShort': 'Cartão',
      'payment.togglePix': 'Pix',
      'extras.pixPrice': 'Pix: {price}',
      'extras.pixPrice20': 'Pix: R$ 1.300',
      'extras.pixPrice30': 'Pix: R$ 1.900',
      'extras.pixPrice40': 'Pix: R$ 2.200',
      'cta.eyebrow': 'Marque sua data',
      'cta.h2': 'Vamos conversar sobre o seu casamento',
      'cta.intro': 'Me conte um pouco sobre vocês e sobre o casamento. Se escolher uma data e horário abaixo, você já agenda uma reunião comigo; se preferir, também pode me escrever direto pelo WhatsApp. Respondo em menos de 8 horas.',
      'cta.imgAlt': 'Noivos no dia do casamento',
      'cta.preferOther': 'Me escreva direto pelo WhatsApp:',
      'cta.whatsappBtn': 'Agendar reunião pelo WhatsApp',
      'form.nombre': 'Seu nome',
      'form.pareja': 'Nome do seu par',
      'form.email': 'E-mail',
      'form.fecha': 'Data e local do casamento',
      'form.fechaPlaceholder': 'Ex.: 12 de outubro, Florianópolis',
      'form.mensaje': 'Conte um pouco mais',
      'form.submit': 'Enviar pelo WhatsApp',
      'form.microcopy': 'Sem compromisso. Respondo em menos de 8h.',
      'footer.socialsAria': 'Instagram do Fernando Opoka Fotografia',
      'footer.fine': '© 2026 Fernando Opoka Fotografia. Seus dados são usados apenas para responder à sua consulta.',
      'footer.privacyLink': 'Política de Privacidade',
      'footer.blogLink': 'Blog',
      'footer.resourcesLink': 'Recursos grátis',
      'lightbox.close': 'Fechar imagem ampliada',
      'lightbox.ariaLabel': 'Ampliar foto',
      'wa.greetingName': 'Olá, sou {name}, ',
      'wa.greetingGeneric': 'Olá, ',
      'wa.wantsPkg': 'quero saber mais sobre o pacote {pkg}',
      'wa.withAlbum': ' com o álbum de {album}',
      'wa.generic': 'quero saber mais sobre os pacotes de fotografia de casamento.',
      'wa.custom': 'não encontrei um pacote que combine totalmente com o que eu preciso. Podemos montar algo sob medida? Vou te contar um pouco o que estou buscando: ',
      'wa.partner': 'Parceiro(a): {partner}.',
      'wa.date': 'Data e local: {date}.',
      'wa.email': 'Meu e-mail: {email}.',
      'wa.extraMsg': 'Mais informações: {msg}'
    },
    en: {
      'lang.switcher': '🌐 Language',
      'hero.imgAlt': 'Newlyweds embracing at their wedding, photography by Fernando Opoka',
      'hero.eyebrow': 'Wedding photography with soul',
      'hero.h1': 'Do you really want to hire the cheapest photographer for your wedding day?',
      'hero.sub': "Your wedding won't happen twice. The photos that tell its story shouldn't be an afterthought either.",
      'hero.btn1': 'How much does it cost?',
      'hero.btn2': "I'd like to book a meeting",
      'hero.btn3': 'How does the process work?',
      'hero.microcopy': "No commitment. I'll reply within 8h.",
      'vsl.placeholder': 'Space reserved for your VSL',
      'problema.imgAlt': 'Emotional moment from the wedding ceremony',
      'problema.eyebrow': 'The problem',
      'problema.h2': "You're looking for more than pretty pictures",
      'problema.p1': 'You want to trust your photographer: in the quality of their work, their warmth, professionalism, and kindness on the most important day of your life.',
      'problema.p2': "I aim to create unforgettable photos, focused on your emotions, your partner's, and the people you love most.",
      'problema.p3': "That's why, before your wedding, we meet: I want to get to know your taste and style before ever picking up the camera.",
      'proceso.eyebrow': 'How we work',
      'proceso.h2': 'A process designed for you to enjoy your day',
      'proceso.step1.num': 'Before',
      'proceso.step1.h3': 'We get to know each other',
      'proceso.step1.p': 'A prior meeting to talk about your story, your taste, and the photo style you want to keep forever, including image consulting.',
      'proceso.step2.num': 'The big day',
      'proceso.step2.h3': 'Full coverage',
      'proceso.step2.p': 'Getting-ready photos, ceremony and reception, with personalized coverage by 2 photographers always watching for real, spontaneous moments.',
      'proceso.step3.num': 'Afterward',
      'proceso.step3.h3': 'No-wait delivery',
      'proceso.step3.p': 'A complete, unlimited digital gallery within 7 days. Depending on your package, same-night photo delivery and printed albums are also available.',
      'promesa.eyebrow': "What's at stake",
      'promesa.h2': 'Hiring the cheapest option can cost you far more than money',
      'promesa.p': "Choosing by price can cost you memories you won't be able to get back later. No one will care about your wedding the way I will.",
      'portafolio.eyebrow': 'Portfolio',
      'portafolio.h2': 'Genuine moments',
      'portafolio.alt1': 'Wedding photo 1', 'portafolio.alt2': 'Wedding photo 2',
      'portafolio.alt3': 'Wedding photo 3', 'portafolio.alt4': 'Wedding photo 4',
      'portafolio.alt5': 'Wedding photo 5', 'portafolio.alt6': 'Wedding photo 6',
      'portafolio.alt7': 'Wedding photo 7', 'portafolio.alt8': 'Wedding photo 8',
      'portafolio.alt9': 'Wedding photo 9', 'portafolio.alt10': 'Wedding photo 10',
      'portafolio.alt11': 'Wedding photo 11', 'portafolio.alt12': 'Wedding photo 12',
      'portafolio.alt13': 'Wedding photo 13', 'portafolio.alt14': 'Wedding photo 14',
      'portafolio.alt15': 'Wedding photo 15', 'portafolio.alt16': 'Wedding photo 16',
      'portafolio.alt17': 'Wedding photo 17', 'portafolio.alt18': 'Wedding photo 18',
      'portafolio.alt19': 'Wedding photo 19', 'portafolio.alt20': 'Wedding photo 20',
      'portafolio.alt21': 'Wedding photo 21', 'portafolio.alt22': 'Wedding photo 22',
      'sobre.imgAlt': 'Fernando Opoka, wedding photographer',
      'sobre.eyebrow': 'About me',
      'sobre.p1': "I've spent 9 years photographing weddings for couples who want more than basic photos: they want someone who genuinely cares about their story.",
      'sobre.p2': 'I work with warmth and closeness, knowing every wedding deserves to be seen with care and respect.',
      'sobre.credit': 'Professional wedding photographer',
      'paquetes.eyebrow': 'Packages',
      'paquetes.h2': 'Choose how you want to live your day',
      'pkg.mini.eyebrow': 'Package 1',
      'pkg.mini.li1': 'Up to 6 hours of coverage',
      'pkg.choice.preboda': 'Pre-wedding session: 25 photos',
      'pkg.choice.makingof': 'Getting-ready coverage',
      'pkg.mini.li2': 'Coverage by 2 photographers',
      'pkg.mini.li3': 'Delivery within 7 days',
      'pkg.mini.li4': '300+ photos from the wedding day',
      'pkg.mini.li5': 'Online gallery to download and share your photos',
      'pkg.mini.li6': 'Free digital invitation',
      'pkg.mini.li7': 'Image consulting',
      'pkg.mini.li8': 'Photos edited the same night of the wedding',
      'pkg.mini.li9': 'Printed 25x25 album, 20-page gift',
      'pkg.mini.priceNote': 'Up to 6 interest-free installments (6x of R$510)',
      'pkg.mini.priceSave': '💚 Paying with Pix: R$ 2,600 (save R$ 460)',
      'pkg.btn': 'I want this package',
      'pkg.plus.badge': 'Gift: 25x25 album, 20 pages (30 pages at 15% off)',
      'pkg.plus.eyebrow': 'Package 2 · most popular',
      'pkg.plus.li1': 'Up to 8 hours of coverage',
      'pkg.plus.li2': 'Pre-wedding session: 50 photos + one 20-second video',
      'pkg.plus.li3': '450+ photos from the wedding day',
      'pkg.plus.li4': '10 photos edited the same night of the wedding',
      'pkg.plus.li5': 'Printed 25x25 album, 20 pages as a gift (or 30 pages at 15% off)',
      'pkg.plus.priceNote': 'Up to 6 interest-free installments (6x of R$941.67)',
      'pkg.plus.priceSave': '💚 Paying with Pix: R$ 4,800 (save R$ 850)',
      'pkg.full.badge': 'Gift: 25x25 album, 20 pages (30-page album at 50% off)',
      'pkg.full.eyebrow': 'Package 3',
      'pkg.full.li1': 'Up to 10 hours of coverage',
      'pkg.full.li2': 'Pre-wedding session: 80 photos + two 20-second videos',
      'pkg.full.li3': '600+ photos from the wedding day',
      'pkg.full.li4': '25 photos edited the same night of the wedding',
      'pkg.full.li5': 'Printed 25x25 album, 20 pages as a gift (or 30 pages at 50% off)',
      'pkg.full.priceNote': 'Up to 6 interest-free installments (6x of R$1,216.67)',
      'pkg.full.priceSave': '💚 Paying with Pix: R$ 6,200 (save R$ 1,100)',
      'extras.eyebrow': 'Want to add an album?',
      'extras.h2': 'Add an extra album to your package',
      'extras.sub': "Choose the size of the 25x25 album you'd like to add to your quote.",
      'extras.giftRibbon': '🎁 FREE',
      'extras.discountBadge': '15%<br>OFF',
      'extras.discountBadge50': '50%<br>OFF',
      'extras.chipTitle': '25x25 Album',
      'extras.chip20Sub': '20 pages',
      'extras.chip30Sub': '30 pages',
      'extras.chip40Sub': '40 pages',
      'extras.chipMayorTitle': 'Larger-size album',
      'extras.chipMayorSub': 'More than 40 pages',
      'extras.continueBtn': 'Continue with my inquiry',
      'extras.travelNotice': '📍 Rates may increase for travel beyond 20 km from Balneário Camboriú.',
      'budget.empty': 'Choose a package above to see your quote here.',
      'budget.subtotalLabel': 'Subtotal',
      'budget.closePopup': 'Close',
      'budget.installmentsLine': '6x of {amount} interest-free',
      'budget.depositLine': '30% deposit: {amount}',
      'budget.albumLabel': '25x25 Album',
      'budget.albumLabelWith': '25x25 Album, {album}',
      'budget.free': 'Included, free',
      'budget.consult': 'Ask for a quote',
      'budget.noAlbum': 'No album',
      'spotlight.hint': 'Choose an option to continue',
      'custom.text': "None of these quite fit? We also put together a custom package tailored to you.",
      'custom.link': "Tell me what you need",
      'payment.eyebrow': 'How to pay',
      'payment.h2': 'Choose your payment method',
      'payment.cardTitle1': 'Credit card',
      'payment.cardSub1': 'Lighter payments: up to 6 interest-free installments',
      'payment.badge': 'Best value',
      'payment.cardTitle2': 'Pix',
      'payment.cardSub2': 'Pay with Pix and get 15% off everything',
      'payment.pixTerms': '30% deposit to reserve the date (only for Pix payments); the rest due up to 30 days before the wedding.',
      'payment.toggleCardFull': 'Credit card',
      'payment.toggleCardShort': 'Card',
      'payment.togglePix': 'Pix',
      'extras.pixPrice': 'Pix: {price}',
      'extras.pixPrice20': 'Pix: R$ 1,300',
      'extras.pixPrice30': 'Pix: R$ 1,900',
      'extras.pixPrice40': 'Pix: R$ 2,200',
      'cta.eyebrow': 'Book your date',
      'cta.h2': "Let's talk about your wedding",
      'cta.intro': "Tell me a bit about you and your wedding. Picking a date and time below books a meeting with me directly; if you'd rather, you can also message me directly on WhatsApp. I'll reply within 8 hours.",
      'cta.imgAlt': 'Newlyweds on their wedding day',
      'cta.preferOther': 'Message me directly on WhatsApp:',
      'cta.whatsappBtn': 'Book a meeting on WhatsApp',
      'form.nombre': 'Your name',
      'form.pareja': "Your partner's name",
      'form.email': 'Email address',
      'form.fecha': 'Wedding date and location',
      'form.fechaPlaceholder': 'E.g. October 12th, Miami',
      'form.mensaje': 'Tell us a bit more',
      'form.submit': 'Send via WhatsApp',
      'form.microcopy': "No commitment. I'll reply within 8h.",
      'footer.socialsAria': 'Instagram for Fernando Opoka Fotografía',
      'footer.fine': '© 2026 Fernando Opoka Fotografía. Your data is used only to respond to your inquiry.',
      'footer.privacyLink': 'Privacy Policy',
      'footer.blogLink': 'Blog',
      'footer.resourcesLink': 'Free resources',
      'lightbox.close': 'Close enlarged image',
      'lightbox.ariaLabel': 'Enlarge photo',
      'wa.greetingName': "Hi, I'm {name}, ",
      'wa.greetingGeneric': 'Hi, ',
      'wa.wantsPkg': "I'd like to ask about the {pkg} package",
      'wa.withAlbum': ' with the {album} album',
      'wa.generic': "I'd like to ask about your wedding photography packages.",
      'wa.custom': "none of the packages quite fit what I'm looking for. Could we put something custom together? Here's a bit about what I need: ",
      'wa.partner': 'Partner: {partner}.',
      'wa.date': 'Date and location: {date}.',
      'wa.email': 'My email: {email}.',
      'wa.extraMsg': 'More info: {msg}'
    }
  };

  function t(key, vars){
    var dict = LANG[currentLang] || LANG.es;
    var str = dict[key];
    if(str === undefined){ str = (LANG.es[key] !== undefined) ? LANG.es[key] : key; }
    if(vars){
      Object.keys(vars).forEach(function(k){
        str = str.split('{' + k + '}').join(vars[k]);
      });
    }
    return str;
  }

  // Traduce "20 páginas" / "30 páginas" / "40 páginas" (así se guardan
  // internamente, como en portugués) a "20 pages" etc. solo para inglés.
  function pageLabelText(label){
    if(currentLang === 'en'){ return label.replace('páginas', 'pages'); }
    return label;
  }

  // Nombre a mostrar de cualquier álbum seleccionado, incluido "mayor" (que no
  // es un tamaño fijo tipo "40 páginas" sino la opción "Álbum mayor" / "Larger
  // album" / "Álbum maior" a consultar). Se apoya en el diccionario de idioma
  // para no repetir el texto traducido en varios lugares del código.
  function albumDisplayName(name){
    if(name === 'mayor'){ return t('extras.chipMayorTitle'); }
    return pageLabelText(name);
  }

  var calInitialized = false;
  function initCalEmbedOnce(lang){
    if(calInitialized || typeof Cal !== 'function') return;
    calInitialized = true;
    var calLangParam = lang === 'pt' ? 'pt-BR' : (lang === 'en' ? 'en' : 'es');
    Cal("init", {origin:"https://cal.com"});
    Cal("inline", {
      elementOrSelector:"#my-cal-inline",
      calLink: "fernando-opoka/prueba?lang=" + calLangParam,
      layout: "month_view",
      config: { "theme": "light", "layout": "month_view" }
    });
    Cal("ui", {
      theme: "light",
      styles: {branding:{brandColor:"#A98A5D"}},
      cssVarsPerTheme: {
        light: {
          "cal-brand": "#A98A5D",
          "cal-brand-emphasis": "#8B6F47",
          "cal-brand-text": "#F7F2EA",
          "cal-bg": "#F7F2EA",
          "cal-bg-emphasis": "#EFE6D6",
          "cal-bg-muted": "#F1E4CE",
          "cal-border": "#E3D6BE",
          "cal-border-emphasis": "#C9AE85",
          "cal-text": "#332B24",
          "cal-text-emphasis": "#332B24",
          "cal-text-subtle": "#5C5245"
        }
      },
      hideEventTypeDetails: false
    });
    // Dispara "Cliente potencial" (Lead) + "Programar" (Schedule) cuando
    // Cal.com confirma que la reunión quedó agendada de verdad.
    Cal("on", {
      action: "bookingSuccessful",
      callback: function(){
        if(window.FO_Track){ FO_Track.bookingConfirmado(); }
      }
    });
  }

  function applyLanguage(lang){
    if(!LANG[lang]) lang = 'es';
    currentLang = lang;
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : (lang === 'en' ? 'en-US' : 'es-AR');

    document.querySelectorAll('[data-i18n]').forEach(function(el){
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function(el){
      el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(function(el){
      el.alt = t(el.getAttribute('data-i18n-alt'));
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function(el){
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el){
      el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });

    initCalEmbedOnce(lang);

    // Vuelve a renderizar precios, banner de regalo, presupuesto y el
    // mensaje de WhatsApp con el nuevo idioma (definido más abajo).
    if(window.FO_rerenderDynamic){ window.FO_rerenderDynamic(); }
  }

  // ---------- SELECTOR DE IDIOMA: modal bloqueante + botón para reabrirlo ----------
  (function(){
    var overlay = document.getElementById('langModalOverlay');
    var buttons = overlay.querySelectorAll('.lang-option');
    var switcher = document.getElementById('langSwitcher');
    var saved = null;
    try{ saved = localStorage.getItem('fo_lang'); }catch(e){}

    function openModal(){
      overlay.hidden = false;
      document.body.style.overflow = 'hidden';
    }
    function closeModal(lang){
      overlay.hidden = true;
      document.body.style.overflow = '';
      try{ localStorage.setItem('fo_lang', lang); }catch(e){}
      applyLanguage(lang);
    }

    buttons.forEach(function(btn){
      btn.addEventListener('click', function(){ closeModal(btn.getAttribute('data-lang')); });
    });
    switcher.addEventListener('click', openModal);

    if(saved && LANG[saved]){
      overlay.hidden = true;
      applyLanguage(saved);
    } else {
      openModal();
      applyLanguage('es'); // contenido de base mientras se elige (queda oculto detrás del modal)
    }
  })();

  // ---------- CARRUSEL DE PORTAFOLIO: duplica las fotos para el loop infinito ----------
  // Se ejecuta antes que el lightbox de abajo para que el buscador de
  // [data-lightbox] encuentre también las fotos duplicadas y las haga clicables,
  // y para que hereden el atributo data-i18n-alt (así también se traducen).
  (function(){
    var track = document.getElementById('portfolioTrack');
    if(!track) return;
    var originals = Array.prototype.slice.call(track.children);
    originals.forEach(function(fig){
      var clone = fig.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true'); // es una copia visual, no la repetimos para lectores de pantalla
      clone.setAttribute('tabindex', '-1');
      track.appendChild(clone);
    });
  })();

  // ---------- CARRUSEL DE PORTAFOLIO: auto-scroll + drag/swipe táctil ----------
  // Antes el movimiento era una animación CSS pura; ahora se maneja con
  // requestAnimationFrame para poder combinarlo con que el usuario toque y
  // deslice la galería con el dedo (o el mouse) para navegarla manualmente.
  (function(){
    var viewport = document.querySelector('.carousel-viewport');
    var track = document.getElementById('portfolioTrack');
    if(!track || !viewport) return;

    var pos = 0; // translateX actual, en px (0 a -halfWidth, con wrap)
    var halfWidth = 0;
    var speed = 0; // px por ms del auto-scroll
    var AUTO_SCROLL_SECONDS = 46; // misma duración que tenía la animación CSS
    var isDragging = false;
    var dragMoved = false;
    var startX = 0;
    var startPos = 0;
    var isHovering = false;
    var reducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    function wrap(p){
      if(halfWidth <= 0) return p;
      while(p > 0){ p -= halfWidth; }
      while(p < -halfWidth){ p += halfWidth; }
      return p;
    }

    function computeWidth(){
      halfWidth = track.scrollWidth / 2;
      speed = halfWidth > 0 ? (halfWidth / (AUTO_SCROLL_SECONDS * 1000)) : 0;
      pos = wrap(pos);
      track.style.transform = 'translateX(' + pos + 'px)';
    }
    computeWidth();
    window.addEventListener('load', computeWidth);
    window.addEventListener('resize', computeWidth);

    viewport.addEventListener('mouseenter', function(){ isHovering = true; });
    viewport.addEventListener('mouseleave', function(){ isHovering = false; });

    function onPointerDown(e){
      if(e.pointerType === 'mouse' && e.button !== 0) return;
      isDragging = true;
      dragMoved = false;
      startX = e.clientX;
      startPos = pos;
      track.classList.add('is-dragging');
      if(track.setPointerCapture){
        try{ track.setPointerCapture(e.pointerId); }catch(err){}
      }
    }
    function onPointerMove(e){
      if(!isDragging) return;
      var dx = e.clientX - startX;
      if(Math.abs(dx) > 4) dragMoved = true;
      pos = wrap(startPos + dx);
      track.style.transform = 'translateX(' + pos + 'px)';
    }
    function endDrag(){
      if(!isDragging) return;
      isDragging = false;
      track.classList.remove('is-dragging');
    }
    track.addEventListener('pointerdown', onPointerDown);
    track.addEventListener('pointermove', onPointerMove);
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    track.addEventListener('pointerleave', function(e){
      // Solo soltar si no se mantiene el botón/gesto presionado sobre otro elemento.
      if(isDragging && e.buttons === 0){ endDrag(); }
    });

    // Si el usuario arrastró (no fue solo un tap/click), evita que el click
    // suelto al final abra el lightbox de esa foto por accidente.
    track.addEventListener('click', function(e){
      if(dragMoved){
        e.preventDefault();
        e.stopPropagation();
        dragMoved = false;
      }
    }, true);

    var lastTs = null;
    function frame(ts){
      if(lastTs === null){ lastTs = ts; }
      var dt = ts - lastTs;
      lastTs = ts;
      if(!isDragging && !isHovering && !reducedMotion && halfWidth > 0){
        pos = wrap(pos - speed * dt);
        track.style.transform = 'translateX(' + pos + 'px)';
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();

  (function(){
    var overlay = document.getElementById('lightbox');
    var overlayImg = document.getElementById('lightboxImg');
    var closeBtn = document.getElementById('lightboxClose');
    var figures = document.querySelectorAll('[data-lightbox]');

    figures.forEach(function(fig){
      var img = fig.querySelector('img');
      if(!img) return;
      fig.setAttribute('tabindex', '0');
      fig.setAttribute('role', 'button');
      fig.setAttribute('aria-label', t('lightbox.ariaLabel'));

      function openLightbox(){
        overlayImg.src = img.src;
        overlayImg.alt = img.alt;
        overlay.classList.add('is-open');
      }
      fig.addEventListener('click', openLightbox);
      fig.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          openLightbox();
        }
      });
    });

    function closeLightbox(){
      overlay.classList.remove('is-open');
      overlayImg.src = '';
    }
    closeBtn.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', function(e){
      if(e.target === overlay) closeLightbox();
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') closeLightbox();
    });
  })();

  // Puente entre el módulo de elección y el de paquetes: permite que
  // "Quiero este paquete" espere a que se resuelva una elección pendiente.
  var AfterChoice = { callbacks: {} };

  // ---------- ELECCIÓN: ENSAYO PRE BODA O MAKING OF (Mini Wedding) ----------
  (function(){
    var groups = {};
    document.querySelectorAll('.li-choice').forEach(function(li){
      var group = li.getAttribute('data-choice-group');
      if(!groups[group]) groups[group] = [];
      groups[group].push(li);
    });

    Object.keys(groups).forEach(function(group){
      var items = groups[group];
      items.forEach(function(li){
        li.setAttribute('role', 'button');
        li.setAttribute('tabindex', '0');

        function choose(){
          items.forEach(function(other){
            var glyph = other.querySelector('.choice-glyph');
            other.classList.add('is-decided');
            if(other === li){
              other.classList.remove('not-included');
              glyph.classList.remove('is-rejected');
              glyph.classList.add('is-chosen');
            } else {
              other.classList.add('not-included');
              glyph.classList.remove('is-chosen');
              glyph.classList.add('is-rejected');
            }
          });

          if(AfterChoice.callbacks[group]){
            var cb = AfterChoice.callbacks[group];
            AfterChoice.callbacks[group] = null;
            cb();
          }
        }

        li.addEventListener('click', choose);
        li.addEventListener('keydown', function(e){
          if(e.key === 'Enter' || e.key === ' '){
            e.preventDefault();
            choose();
          }
        });
      });
    });
  })();

  // ---------- PAQUETES + SERVICIOS EXTRAS + PRESUPUESTADOR + WHATSAPP ----------
  (function(){
    var pkgButtons = document.querySelectorAll('.pkg-select');
    var pkgCards = document.querySelectorAll('.pkg-card');
    var extraChips = document.querySelectorAll('.extra-chip');
    var continueBtn = document.getElementById('extrasContinue');
    var mensajeField = document.getElementById('mensaje');
    var nombreField = document.getElementById('nombre');
    var parejaField = document.getElementById('pareja');
    var emailField = document.getElementById('email');
    var fechaField = document.getElementById('fecha');
    var whatsappBtn = document.getElementById('whatsappBtn');
    var customPkgLink = document.getElementById('customPkgLink');
    var whatsappForm = document.getElementById('whatsappForm');

           // Pixel: registra "Contact" al tocar el boton principal de WhatsApp.
           if(whatsappBtn){
                      whatsappBtn.addEventListener('click', function(){
                                   if(window.FO_Track){ FO_Track.contact(); }
                      });
           }

    var giftBanner = document.getElementById('giftBanner');
    var chip20 = document.getElementById('chip20');
    var chip20Ribbon = document.getElementById('chip20Ribbon');
    var chip20Badge = document.getElementById('chip20Badge');
    var chip20Price = document.getElementById('chip20Price');
    var chip20PriceSub = document.getElementById('chip20PriceSub');
    var chip30 = document.getElementById('chip30');
    var chip30Ribbon = document.getElementById('chip30Ribbon');
    var chip30Badge = document.getElementById('chip30Badge');
    var chip30Price = document.getElementById('chip30Price');
    var chip30PriceSub = document.getElementById('chip30PriceSub');
    var chip40 = document.getElementById('chip40');
    var chip40Badge = document.getElementById('chip40Badge');
    var chip40Price = document.getElementById('chip40Price');
    var chip40PriceSub = document.getElementById('chip40PriceSub');

    // ---------- PAGO: tarjeta (precio oficial, hasta 6 cuotas) vs Pix (descuento) ----------
    // Es ilegal cobrar más por usar tarjeta, así que el precio "de lista" que
    // se ve en cada paquete/álbum es el de tarjeta; Pix se muestra como el
    // descuento por pagar así. El switch permite comparar ambos en vivo.
    var paymentMode = 'card'; // 'card' | 'pix'
    var floatingPaymentToggle = document.getElementById('floatingPaymentToggle');
    var paymentCardCard = document.getElementById('paymentCardCard');
    var paymentCardPix = document.getElementById('paymentCardPix');

    function setPaymentMode(mode){
      paymentMode = mode;
      [floatingPaymentToggle].forEach(function(toggle){
        if(!toggle) return;
        // La píldora (.toggle-thumb) se desliza vía transform según esta
        // clase; los botones solo cambian de color, nunca de fondo, para que
        // el único movimiento visible sea el de la píldora (fluido, como los
        // switches de iOS).
        toggle.classList.remove('mode-card', 'mode-pix');
        toggle.classList.add('mode-' + mode);
        toggle.querySelectorAll('button').forEach(function(btn){
          btn.classList.toggle('is-active', btn.getAttribute('data-mode') === mode);
        });
      });
      // Las tarjetas de "Métodos de pago" también reflejan y controlan el modo actual.
      if(paymentCardCard){ paymentCardCard.classList.toggle('is-selected', mode === 'card'); }
      if(paymentCardPix){ paymentCardPix.classList.toggle('is-selected', mode === 'pix'); }
      updateBudget();
      pulseAmounts();
    }

    // Reinicia (retriggerea) la animación de "pulso" en los números y la
    // línea de cuotas cada vez que cambia el modo de pago, para que el
    // cambio de valor/color se note en vez de saltar de golpe.
    function pulseAmounts(){
      [budgetPkgAmount, budgetExtraAmount, budgetSubtotal, budgetInstallments,
       floatingSubtotalAmount, floatingSubtotalInstallments].forEach(function(el){
        if(!el || el.hidden) return;
        el.classList.remove('amount-pulse');
        void el.offsetWidth; // fuerza reflow para poder repetir la animación
        el.classList.add('amount-pulse');
      });
    }

    // Un solo click en CUALQUIER parte del switch (no importa sobre qué botón
    // caiga) lo manda siempre al lado opuesto, como un interruptor físico.
    [floatingPaymentToggle].forEach(function(toggle){
      if(!toggle) return;
      toggle.addEventListener('click', function(){
        setPaymentMode(paymentMode === 'pix' ? 'card' : 'pix');
      });
    });

    // Las tarjetas grandes de "Métodos de pago" también son clickeables: cada
    // una fija directamente el modo que representa (no alternan como el switch).
    [paymentCardCard, paymentCardPix].forEach(function(card){
      if(!card) return;
      card.addEventListener('click', function(){
        setPaymentMode(card.getAttribute('data-mode'));
      });
      card.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          setPaymentMode(card.getAttribute('data-mode'));
        }
      });
    });

    function currentPrice(obj){
      return paymentMode === 'pix' ? obj.pricePix : obj.priceCard;
    }

    var budgetEmpty = document.getElementById('budgetEmpty');
    var budgetPkgLine = document.getElementById('budgetPkgLine');
    var budgetPkgLabel = document.getElementById('budgetPkgLabel');
    var budgetPkgAmount = document.getElementById('budgetPkgAmount');
    var budgetExtraLine = document.getElementById('budgetExtraLine');
    var budgetExtraLabel = document.getElementById('budgetExtraLabel');
    var budgetExtraAmount = document.getElementById('budgetExtraAmount');
    var budgetTotalLine = document.getElementById('budgetTotalLine');
    var budgetSubtotal = document.getElementById('budgetSubtotal');
    var budgetInstallments = document.getElementById('budgetInstallments');

    var floatingSubtotal = document.getElementById('floatingSubtotal');
    var floatingSubtotalClose = document.getElementById('floatingSubtotalClose');
    var floatingSubtotalPkg = document.getElementById('floatingSubtotalPkg');
    var floatingSubtotalExtra = document.getElementById('floatingSubtotalExtra');
    var floatingSubtotalInstallments = document.getElementById('floatingSubtotalInstallments');
    var floatingSubtotalAmount = document.getElementById('floatingSubtotalAmount');
    var hasBudgetToShow = false;

    // El popup flotante imita a un subtotal "sticky": solo aparece cuando el
    // subtotal real (dentro del presupuestador) se sale de la pantalla, y se
    // esconde de nuevo apenas ese subtotal real vuelve a estar visible — así
    // nunca se ven los dos números al mismo tiempo. Además se exige que:
    // (1) haya un paquete Y un álbum ya elegidos (no alcanza con solo el
    // paquete), (2) el usuario haya visto el presupuestador real al menos una
    // vez, y (3) haya dejado de verlo (scrolleado fuera de vista). También se
    // puede cerrar a mano con el botón de "✕", quedando oculto hasta que haya
    // algo nuevo que avisar.
    var realSubtotalVisible = true; // si aún no hay IntersectionObserver, asumimos visible (no mostrar popup)
    var hasSeenRealSubtotal = false;
    var popupDismissed = false;
    function syncFloatingPopup(){
      var hasPackageAndAlbum = !!selectedPackage && !!selectedExtra;
      var shouldShow = hasPackageAndAlbum && hasSeenRealSubtotal && !realSubtotalVisible && !popupDismissed;
      floatingSubtotal.classList.toggle('is-visible', shouldShow);
    }

    if('IntersectionObserver' in window && budgetTotalLine){
      var subtotalObserver = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          realSubtotalVisible = entry.isIntersecting;
          if(entry.isIntersecting){ hasSeenRealSubtotal = true; }
          syncFloatingPopup();
        });
      }, {threshold: 0});
      subtotalObserver.observe(budgetTotalLine);
    }

    if(floatingSubtotalClose){
      floatingSubtotalClose.addEventListener('click', function(){
        popupDismissed = true;
        syncFloatingPopup();
      });
    }

    var selectedPackage = null; // { id, name, pricePix, priceCard }
    var selectedExtra = null;   // { name, pricePix, priceCard, status: 'priced' | 'free' | 'consult' }
    var wantsCustom = false;    // true si tocó "Contame qué necesitás" (paquete personalizado)

    function formatBRL(n){
      var locale = currentLang === 'en' ? 'en-US' : (currentLang === 'pt' ? 'pt-BR' : 'es-AR');
      return 'R$ ' + n.toLocaleString(locale);
    }

    // Anima un monto tipo "contador" (como un odómetro) desde el valor
    // anterior hasta el nuevo, rápido, en vez de saltar directo al número.
    function animateAmount(el, toValue){
      if(!el) return;
      toValue = Math.round(toValue);
      var prevRaw = parseFloat(el.getAttribute('data-raw'));
      if(isNaN(prevRaw)){
        // Primera vez que se llena este campo: sin animación, directo al valor.
        el.setAttribute('data-raw', toValue);
        el.textContent = formatBRL(toValue);
        return;
      }
      el.setAttribute('data-raw', toValue);
      if(prevRaw === toValue){ el.textContent = formatBRL(toValue); return; }
      if(el._amountRAF){ cancelAnimationFrame(el._amountRAF); el._amountRAF = null; }
      if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
        el.textContent = formatBRL(toValue);
        return;
      }
      var startTime = null;
      var duration = 320; // rápido, tipo contador que corre y frena
      function step(ts){
        if(startTime === null) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(prevRaw + (toValue - prevRaw) * eased);
        el.textContent = formatBRL(current);
        if(progress < 1){
          el._amountRAF = requestAnimationFrame(step);
        } else {
          el._amountRAF = null;
        }
      }
      el._amountRAF = requestAnimationFrame(step);
    }

    // Muestra un badge (regalo o descuento) con la animación tipo pop-up de 0.6s.
    function popShow(el){
      el.hidden = false;
      el.classList.remove('pop-anim');
      void el.offsetWidth; // fuerza reflow para poder repetir la animación
      el.classList.add('pop-anim');
    }
    function popHide(el){
      el.hidden = true;
      el.classList.remove('pop-anim');
    }

    // Cada tamaño de álbum tiene su precio base y su versión con 15% off,
    // cada uno con su valor en tarjeta (base/off * mismo recargo que en los
    // paquetes) y en Pix (el que ya estaba). El texto se formatea siempre
    // con formatBRL para respetar el idioma.
    var ALBUM_INFO = {
      '20 páginas': {chip: chip20, badge: chip20Badge, ribbon: chip20Ribbon, price: chip20Price, priceSub: chip20PriceSub, base: 1300, off: 1105, cardBase: 1530, cardOff: 1300},
      '30 páginas': {chip: chip30, badge: chip30Badge, ribbon: chip30Ribbon, price: chip30Price, priceSub: chip30PriceSub, base: 1900, off: 950, cardBase: 2240, cardOff: 1120},
      '40 páginas': {chip: chip40, badge: chip40Badge, ribbon: null,        price: chip40Price, priceSub: chip40PriceSub, base: 2200, off: 1870, cardBase: 2590, cardOff: 2200}
    };

    // Qué álbumes regala cada paquete (puede ser más de uno, a elección) y
    // a cuáles les aplica descuento (el % de descuento de cada álbum está en
    // su propio "off"/"cardOff" dentro de ALBUM_INFO: 40 páginas es 15% off,
    // 30 páginas en Full Wedding es 50% off). Wedding Plus tiene su propio
    // descuento del 15% en el álbum de 30 páginas vía "overrides" (distinto
    // al 50% de Full Wedding, que usa los valores por defecto de ALBUM_INFO).
    // Mini no regala ni descuenta nada.
    var ALBUM_RULES_BY_PACKAGE = {
      plus: {
        gift: ['20 páginas'],
        discount: ['30 páginas'],
        overrides: {
          '30 páginas': { off: 1615, cardOff: 1904, badgeKey: 'extras.discountBadge' }
        }
      },
      full: { gift: ['20 páginas'], discount: ['30 páginas', '40 páginas'] }
    };

    function currentAlbumRules(){
      if(!selectedPackage) return {gift: [], discount: []};
      return ALBUM_RULES_BY_PACKAGE[selectedPackage.id] || {gift: [], discount: []};
    }

    // Actualiza el estado (regalo / 15% off / precio normal) de los 3 álbumes
    // según el paquete elegido, y sincroniza el precio del álbum ya seleccionado.
    // También sirve para volver a pintar los precios cuando cambia el idioma.
    function updateGiftMode(){
      var rules = currentAlbumRules();
      var hasGift = rules.gift.length > 0;
      giftBanner.hidden = !hasGift;
      if(hasGift){
        var giftText = rules.gift.length > 1
          ? rules.gift.map(pageLabelText).join(currentLang === 'pt' ? ' ou ' : (currentLang === 'en' ? ' or ' : ' o '))
          : pageLabelText(rules.gift[0]);
        var choiceSuffix = rules.gift.length > 1
          ? (currentLang === 'pt' ? ', à sua escolha' : (currentLang === 'en' ? ', your choice' : ', a elección'))
          : '';
        var emoji = '🎁 ';
        var body = currentLang === 'pt'
          ? emoji + 'Seu ' + selectedPackage.name + ' já inclui o álbum 25x25 de ' + giftText + choiceSuffix + ' de presente'
          : currentLang === 'en'
            ? emoji + 'Your ' + selectedPackage.name + ' already includes the 25x25 album, ' + giftText + choiceSuffix + ', as a gift'
            : emoji + 'Tu ' + selectedPackage.name + ' ya incluye el álbum 25x25 de ' + giftText + choiceSuffix + ' de regalo';
        giftBanner.textContent = body;
      }

      Object.keys(ALBUM_INFO).forEach(function(pageLabel){
        var info = ALBUM_INFO[pageLabel];
        var isGifted = rules.gift.indexOf(pageLabel) !== -1;
        var isDiscounted = !isGifted && rules.discount.indexOf(pageLabel) !== -1;

        info.chip.classList.toggle('is-gift', isGifted);

        if(info.ribbon){
          if(isGifted){ popShow(info.ribbon); } else { popHide(info.ribbon); }
        }
        var override = rules.overrides && rules.overrides[pageLabel];
        var effOff = override ? override.off : info.off;
        var effCardOff = override ? override.cardOff : info.cardOff;

        if(isDiscounted){
          var badgeKey = (override && override.badgeKey) || info.badge.getAttribute('data-i18n-html');
          if(badgeKey){ info.badge.innerHTML = t(badgeKey); }
          popShow(info.badge);
          info.chip.setAttribute('data-price-pix', effOff);
          info.chip.setAttribute('data-price-card', effCardOff);
          info.price.innerHTML = '<span class="price-old">' + formatBRL(info.cardBase) + '</span> ' + formatBRL(effCardOff);
          if(info.priceSub){ info.priceSub.textContent = t('extras.pixPrice', {price: formatBRL(effOff)}); info.priceSub.hidden = false; }
        } else {
          popHide(info.badge);
          info.chip.setAttribute('data-price-pix', info.base);
          info.chip.setAttribute('data-price-card', info.cardBase);
          if(!isGifted){
            info.price.textContent = formatBRL(info.cardBase);
            if(info.priceSub){ info.priceSub.textContent = t('extras.pixPrice', {price: formatBRL(info.base)}); info.priceSub.hidden = false; }
          }
        }

        if(isGifted){
          info.price.textContent = t('budget.free');
          if(info.priceSub){ info.priceSub.hidden = true; }
        }

        if(selectedExtra && selectedExtra.name === pageLabel){
          if(isGifted){
            selectedExtra.status = 'free';
            selectedExtra.pricePix = 0;
            selectedExtra.priceCard = 0;
          } else if(isDiscounted){
            selectedExtra.status = 'priced';
            selectedExtra.pricePix = effOff;
            selectedExtra.priceCard = effCardOff;
          } else {
            selectedExtra.status = 'priced';
            selectedExtra.pricePix = info.base;
            selectedExtra.priceCard = info.cardBase;
          }
        }
      });
    }

    function updateBudget(){
      var hasPkg = !!selectedPackage;
      var hasExtra = !!selectedExtra;
      // En Pix los valores son más bajos (con descuento), así que los números
      // se muestran en verde; en tarjeta vuelven a su color normal.
      var isPixMode = (paymentMode !== 'card');

      budgetEmpty.hidden = hasPkg;

      budgetPkgLine.hidden = !hasPkg;
      if(hasPkg){
        budgetPkgLabel.textContent = selectedPackage.name;
        animateAmount(budgetPkgAmount, currentPrice(selectedPackage));
        budgetPkgAmount.classList.toggle('is-pix', isPixMode);
      }

      budgetExtraLine.hidden = !hasPkg;
      if(hasExtra){
        budgetExtraLabel.textContent = t('budget.albumLabelWith', {album: albumDisplayName(selectedExtra.name)});
        if(selectedExtra.status === 'free'){
          budgetExtraAmount.removeAttribute('data-raw');
          budgetExtraAmount.textContent = t('budget.free');
          budgetExtraAmount.classList.remove('is-pix');
        } else if(selectedExtra.status === 'consult'){
          budgetExtraAmount.removeAttribute('data-raw');
          budgetExtraAmount.textContent = t('budget.consult');
          budgetExtraAmount.classList.remove('is-pix');
        } else {
          animateAmount(budgetExtraAmount, currentPrice(selectedExtra));
          budgetExtraAmount.classList.toggle('is-pix', isPixMode);
        }
      } else {
        budgetExtraLabel.textContent = t('budget.albumLabel');
        budgetExtraAmount.removeAttribute('data-raw');
        budgetExtraAmount.textContent = t('budget.noAlbum');
        budgetExtraAmount.classList.remove('is-pix');
      }

      var showTotal = hasPkg || hasExtra;
      budgetTotalLine.hidden = !showTotal;
      if(showTotal){
        var extraAdds = (hasExtra && selectedExtra.status === 'priced') ? currentPrice(selectedExtra) : 0;
        var total = (hasPkg ? currentPrice(selectedPackage) : 0) + extraAdds;
        animateAmount(budgetSubtotal, total);
        animateAmount(floatingSubtotalAmount, total);
        budgetSubtotal.classList.toggle('is-pix', isPixMode);
        floatingSubtotalAmount.classList.toggle('is-pix', isPixMode);
        floatingSubtotalPkg.textContent = hasPkg ? selectedPackage.name : '';
        floatingSubtotalExtra.textContent = hasExtra ? albumDisplayName(selectedExtra.name) : '';

        // Siempre se muestra una sola línea de nota (nunca las dos a la vez
        // ni ninguna) para que la caja del presupuestador y el popup no
        // cambien de tamaño al pasar de tarjeta a Pix o viceversa.
        var noteText = (paymentMode === 'card')
          ? t('budget.installmentsLine', {amount: formatBRL(Math.round(total / 6))})
          : t('budget.depositLine', {amount: formatBRL(Math.round(total * 0.3))});
        budgetInstallments.textContent = noteText;
        budgetInstallments.hidden = false;
        budgetInstallments.classList.toggle('is-pix', isPixMode);
        floatingSubtotalInstallments.textContent = noteText;
        floatingSubtotalInstallments.hidden = false;
        floatingSubtotalInstallments.classList.toggle('is-pix', isPixMode);

        hasBudgetToShow = true;
      } else {
        budgetInstallments.hidden = true;
        floatingSubtotalInstallments.hidden = true;
        hasBudgetToShow = false;
      }
      syncFloatingPopup();
    }

    // ---------- WHATSAPP: mensaje predeterminado según lo que eligió el cliente ----------
    var WHATSAPP_NUMBER = '5547988821970'; // +55 47 98882-1970

    // Sin backend: los datos del formulario (nombre, pareja, fecha/lugar,
    // correo, mensaje libre) no se "envían" a ningún lado, sino que
    // enriquecen en vivo el texto predeterminado del botón de WhatsApp.
    function updateWhatsappLink(){
      if(!whatsappBtn) return;
      var name = (nombreField && nombreField.value.trim()) ? nombreField.value.trim() : '';
      var partner = (parejaField && parejaField.value.trim()) ? parejaField.value.trim() : '';
      var email = (emailField && emailField.value.trim()) ? emailField.value.trim() : '';
      var date = (fechaField && fechaField.value.trim()) ? fechaField.value.trim() : '';
      var extraMsg = (mensajeField && mensajeField.value.trim()) ? mensajeField.value.trim() : '';

      var msg = name ? t('wa.greetingName', {name: name}) : t('wa.greetingGeneric');

      if(wantsCustom){
        msg += t('wa.custom');
      } else if(selectedPackage){
        msg += t('wa.wantsPkg', {pkg: selectedPackage.name});
        if(selectedExtra){
          msg += t('wa.withAlbum', {album: albumDisplayName(selectedExtra.name)});
        }
        msg += '.';
      } else {
        msg += t('wa.generic');
      }

      var extraLines = [];
      if(partner) extraLines.push(t('wa.partner', {partner: partner}));
      if(date) extraLines.push(t('wa.date', {date: date}));
      if(email) extraLines.push(t('wa.email', {email: email}));
      if(extraMsg) extraLines.push(t('wa.extraMsg', {msg: extraMsg}));
      if(extraLines.length){
        msg += '\n' + extraLines.join('\n');
      }

      whatsappBtn.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);
    }

    [nombreField, parejaField, emailField, fechaField, mensajeField].forEach(function(field){
      if(field){ field.addEventListener('input', updateWhatsappLink); }
    });

    // El formulario ya no "envía" nada a un servidor: solo se asegura de que
    // el mensaje esté armado con los últimos datos y abre WhatsApp directo.
    if(whatsappForm){
      whatsappForm.addEventListener('submit', function(e){
                   if(window.FO_Track){ FO_Track.contact(); }
        e.preventDefault();
        updateWhatsappLink();
        window.open(whatsappBtn.href, '_blank');
      });
    }

    if(customPkgLink){
      customPkgLink.addEventListener('click', function(e){
                   if(window.FO_Track){ FO_Track.contact(); }
        e.preventDefault();
        wantsCustom = true;
        updateWhatsappLink();
        customPkgLink.href = whatsappBtn.href;
        window.open(whatsappBtn.href, '_blank');
      });
    }

    // Hook global: applyLanguage() lo llama para que todo lo dinámico
    // (precios, banner de regalo, presupuesto, whatsapp) se vuelva a
    // renderizar en el idioma recién elegido.
    window.FO_rerenderDynamic = function(){
      updateGiftMode();
      updateBudget();
      updateWhatsappLink();
    };

    // Spotlight: resalta la elección pendiente de "ensayo pre boda / making of"
    // oscureciendo el resto de la página, y retoma la acción del botón al elegir.
    var spotlightOverlay = document.getElementById('pkgSpotlightOverlay');
    var spotlightBox = document.getElementById('pkgSpotlightBox');
    var spotlightHint = document.getElementById('pkgSpotlightHint');

    function isMiniSessionDecided(){
      var decided = false;
      document.querySelectorAll('[data-choice-group="mini-session"]').forEach(function(li){
        if(li.classList.contains('is-decided')) decided = true;
      });
      return decided;
    }

    // Bloquea/libera el scroll de la página mientras el spotlight obliga a
    // elegir entre ensayo pre boda o making of (Mini Wedding). Compensa el
    // ancho de la scrollbar para que el contenido no salte al ocultarla.
    function lockPageScroll(){
      var scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if(scrollBarWidth > 0){ document.body.style.paddingRight = scrollBarWidth + 'px'; }
    }
    function unlockPageScroll(){
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    // Antes se usaba un setTimeout fijo de 350ms para esperar a que termine
    // el scroll y recién ahí medir la posición de los ítems a resaltar. En
    // scrolls largos (o en celulares más lentos) el scroll todavía no había
    // terminado a los 350ms, y el spotlight se dibujaba mal encuadrado.
    // Ahora se espera de verdad a que el scroll se detenga (varios frames
    // seguidos sin cambio de posición), con un tope de seguridad por si el
    // scroll nunca se estabiliza del todo.
    function waitForScrollSettle(callback){
      var maxWait = 1200;
      var stableFramesNeeded = 4;
      var start = performance.now();
      var lastY = window.scrollY;
      var stableCount = 0;
      function tick(){
        var currentY = window.scrollY;
        if(Math.abs(currentY - lastY) < 0.5){
          stableCount++;
        } else {
          stableCount = 0;
          lastY = currentY;
        }
        if(stableCount >= stableFramesNeeded || (performance.now() - start) > maxWait){
          callback();
          return;
        }
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    function hideSpotlight(){
      spotlightBox.classList.remove('is-visible');
      spotlightHint.classList.remove('is-visible');
      spotlightBox.hidden = true;
      spotlightOverlay.hidden = true;
      spotlightHint.hidden = true;
      unlockPageScroll();
      document.removeEventListener('click', onOutsideSpotlightClick, true);
    }

    // El overlay ya no intercepta el click (pointer-events:none), así que un
    // solo click sobre "Ensayo pre boda" o "Making of" elige y avanza de una:
    // este listener en document (fase de captura) solo cierra el spotlight
    // cuando el click cae AFUERA de los ítems resaltados.
    function onOutsideSpotlightClick(e){
      var insideChoice = e.target.closest && e.target.closest('[data-choice-group="mini-session"]');
      if(!insideChoice){
        hideSpotlight();
        AfterChoice.callbacks['mini-session'] = null;
      }
    }

    function showSpotlight(){
      var items = document.querySelectorAll('[data-choice-group="mini-session"]');
      if(!items.length) return;
      var pad = 6;
      var top = Infinity, left = Infinity, right = -Infinity, bottom = -Infinity;
      items.forEach(function(el){
        var r = el.getBoundingClientRect();
        top = Math.min(top, r.top);
        left = Math.min(left, r.left);
        right = Math.max(right, r.right);
        bottom = Math.max(bottom, r.bottom);
      });
      spotlightBox.style.top = (top - pad) + 'px';
      spotlightBox.style.left = (left - pad) + 'px';
      spotlightBox.style.width = (right - left + pad * 2) + 'px';
      spotlightBox.style.height = (bottom - top + pad * 2) + 'px';
      spotlightBox.hidden = false;
      spotlightOverlay.hidden = false;

      // Posiciona el hint (texto + flecha) pegado al recuadro resaltado, para
      // que la flecha señale de verdad a las opciones de "ensayo pre boda" /
      // "making of", en vez de quedar suelto en un punto fijo de la pantalla.
      // Si no entra debajo (opciones muy abajo en la pantalla), se coloca
      // arriba del recuadro con la flecha invertida apuntando hacia abajo.
      spotlightHint.hidden = false;
      spotlightHint.classList.remove('is-visible', 'is-above');
      var hintWidth = spotlightHint.offsetWidth || 220;
      var hintHeight = spotlightHint.offsetHeight || 90;
      var gap = 14;
      var boxVisualBottom = bottom + pad;
      var boxVisualTop = top - pad;
      var belowY = boxVisualBottom + gap;
      var placeAbove = (belowY + hintHeight + 10) > window.innerHeight;
      var topY = placeAbove ? (boxVisualTop - gap - hintHeight) : belowY;
      topY = Math.max(10, Math.min(topY, window.innerHeight - hintHeight - 10));
      var centerX = (left + right) / 2;
      var halfW = hintWidth / 2 + 10;
      centerX = Math.max(halfW, Math.min(centerX, window.innerWidth - halfW));
      spotlightHint.style.left = centerX + 'px';
      spotlightHint.style.top = topY + 'px';
      if(placeAbove){ spotlightHint.classList.add('is-above'); }

      lockPageScroll();
      requestAnimationFrame(function(){
        spotlightBox.classList.add('is-visible');
        spotlightHint.classList.add('is-visible');
      });
      // Se agrega recién ahora (no antes) para no capturar el mismo click del
      // botón "Quiero este paquete" que disparó el spotlight.
      setTimeout(function(){
        document.addEventListener('click', onOutsideSpotlightClick, true);
      }, 0);
    }

    pkgButtons.forEach(function(btn){
      btn.addEventListener('click', function(){
        var card = btn.closest('.pkg-card');
        var pkgId = card.getAttribute('data-package');

        function activate(){
          selectedPackage = {
            id: pkgId,
            name: card.getAttribute('data-package-name'),
            pricePix: parseInt(card.getAttribute('data-price-pix'), 10) || 0,
            priceCard: parseInt(card.getAttribute('data-price-card'), 10) || 0
          };
          wantsCustom = false; // si ahora eligió un paquete, ya no es "paquete personalizado"
          popupDismissed = false; // hay presupuesto nuevo: si lo había cerrado, puede volver a aparecer
          pkgCards.forEach(function(c){ c.classList.remove('is-selected'); });
          card.classList.add('is-selected');
          updateGiftMode();

          var rules = currentAlbumRules();
          var defaultAlbum = rules.defaultGift || (rules.gift.length === 1 ? rules.gift[0] : null);
          if(defaultAlbum){
            selectedExtra = { name: defaultAlbum, pricePix: 0, priceCard: 0, status: 'free' };
            extraChips.forEach(function(c){ c.classList.remove('is-selected'); });
            ALBUM_INFO[defaultAlbum].chip.classList.add('is-selected');
          }

          updateBudget();
          updateWhatsappLink();
          // Una vez que el cliente ya vio el presupuestador real (es decir,
          // ya completó el recorrido normal una vez), si vuelve a elegir
          // otro paquete es porque está comparando precios: ya no lo
          // mandamos de nuevo a la sección de álbumes, para no interrumpirle
          // la comparación con un scroll automático.
          if(!hasSeenRealSubtotal){
            document.getElementById('extras').scrollIntoView({behavior:'smooth', block:'start'});
          }
        }

        if(pkgId === 'mini' && !isMiniSessionDecided()){
          card.scrollIntoView({behavior:'smooth', block:'center'});
          AfterChoice.callbacks['mini-session'] = function(){
            hideSpotlight();
            activate();
          };
          waitForScrollSettle(showSpotlight);
          return;
        }

        activate();
      });
    });

    extraChips.forEach(function(chip){
      chip.addEventListener('click', function(){
        var name = chip.getAttribute('data-extra');
        var pixAttr = chip.getAttribute('data-price-pix');
        var cardAttr = chip.getAttribute('data-price-card');
        var gift = chip.classList.contains('is-gift');
        var status = gift ? 'free' : (pixAttr ? 'priced' : 'consult');
        var pricePix = gift ? 0 : (pixAttr ? parseInt(pixAttr, 10) : 0);
        var priceCard = gift ? 0 : (cardAttr ? parseInt(cardAttr, 10) : 0);

        if(selectedExtra && selectedExtra.name === name){
          selectedExtra = null;
          chip.classList.remove('is-selected');
        } else {
          selectedExtra = { name: name, pricePix: pricePix, priceCard: priceCard, status: status };
          extraChips.forEach(function(c){ c.classList.remove('is-selected'); });
          chip.classList.add('is-selected');
          popupDismissed = false; // hay presupuesto nuevo: si lo había cerrado, puede volver a aparecer
          // Al elegir un álbum, llevamos la vista hasta "Métodos de pago" para
          // que decida cómo pagar sin tener que buscarlo manualmente — pero
          // solo la primera vez: si ya vio el presupuestador real antes, es
          // que está comparando álbumes, y no lo interrumpimos con scroll.
          if(!hasSeenRealSubtotal){
            var paymentMethodsSection = document.querySelector('.payment-methods');
            if(paymentMethodsSection){
              setTimeout(function(){
                paymentMethodsSection.scrollIntoView({behavior:'smooth', block:'start'});
              }, 50);
            }
          }
        }
        updateBudget();
        updateWhatsappLink();
      });
    });

    // Render inicial (sin paquete elegido todavía): precios base y botón de WhatsApp genérico.
    updateGiftMode();
    updateWhatsappLink();
  })();

  // Revelado por scroll (solo aplica visualmente en mobile, ver CSS):
  // en "El problema", "Sobre mí" y la sección de WhatsApp, el bloque de
  // texto se desliza y aparece encima de la foto cuando entra en pantalla.
  (function(){
    var revealGrids = document.querySelectorAll('.problema .grid, .sobre .grid, .cta-final .grid');
    if(!revealGrids.length) return;
    if(!('IntersectionObserver' in window)){
      revealGrids.forEach(function(grid){ grid.classList.add('in-view'); });
      return;
    }
    var revealObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {threshold:0.25, rootMargin:'0px 0px -10% 0px'});
    revealGrids.forEach(function(grid){ revealObserver.observe(grid); });
  })();
