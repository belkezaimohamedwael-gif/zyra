export const PHOTOS = {
  hero1: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1600&q=85',
  hero2: 'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=1600&q=85',
  hero3: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=85',
  p1: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=700&q=80',
  p2: 'https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?w=700&q=80',
  p3: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=700&q=80',
  p4: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=700&q=80',
  p5: 'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=700&q=80',
  p6: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=700&q=80',
  p7: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=700&q=80',
  p8: 'https://images.unsplash.com/photo-1494386346843-e12284507169?w=700&q=80',
};

export const SIZES = [36, 37, 38, 39, 40, 41, 42];

export const CATEGORIES = ['All', 'Flats', 'Sandals', 'Boots', 'Mules', 'Heels'];

export const WILAYAS = [
  'Adrar','Chlef','Laghouat','Oum El Bouaghi','Batna','Béjaïa','Biskra','Béchar',
  'Blida','Bouira','Tamanrasset','Tébessa','Tlemcen','Tiaret','Tizi Ouzou','Alger',
  'Djelfa','Jijel','Sétif','Saïda','Skikda','Sidi Bel Abbès','Annaba','Guelma',
  'Constantine','Médéa','Mostaganem',"M'Sila",'Mascara','Ouargla','Oran','El Bayadh',
  'Illizi','Bordj Bou Arréridj','Boumerdès','El Tarf','Tindouf','Tissemsilt',
  'El Oued','Khenchela','Souk Ahras','Tipaza','Mila','Aïn Defla','Naâma',
  'Aïn Témouchent','Ghardaïa','Relizane','Timimoun','Bordj Badji Mokhtar',
  'Ouled Djellal','Béni Abbès','In Salah','In Guezzam','Touggourt','Djanet',
  "El M'Ghair",'El Meniaa',
];

export const fmt = (n: number) => n.toLocaleString('fr-DZ') + ' DA';

export const HERO_SLIDES = [
  { img: PHOTOS.hero1, title: ['Step into', 'Pure', 'Elegance'], accent: 'Pure', sub: 'Chaussures féminines · Livraison partout en Algérie' },
  { img: PHOTOS.hero2, title: ['Walk in', 'Your Own', 'Story'], accent: 'Your Own', sub: 'Nouvelle collection Printemps 2026' },
  { img: PHOTOS.hero3, title: ['Crafted for', 'Every', 'Moment'], accent: 'Every', sub: 'Qualité artisanale · Livraison à domicile' },
];

export const TESTIMONIALS = [
  { text: "Les chaussures ZYRA sont d'une qualité incroyable. J'ai commandé les Petal Flat et elles sont arrivées en 2 jours à Oran. Je recommande à toutes mes amies !", name: 'Amira B.', city: 'Oran' },
  { text: "Enfin une marque algérienne qui comprend le style féminin moderne. Le paiement à la livraison c'est parfait, pas de risque.", name: 'Sara K.', city: 'Alger' },
  { text: "Les sandales Rosé sont magnifiques. La livraison était rapide même à Constantine. J'en ai déjà commandé deux autres paires.", name: 'Lina M.', city: 'Constantine' },
];

export const FEATURES = [
  { icon: '🚚', title: 'Livraison à Domicile', sub: '58 wilayas couvertes' },
  { icon: '💳', title: 'Paiement à la Livraison', sub: 'Payez en cash à réception' },
  { icon: '📦', title: 'Retours Gratuits', sub: "14 jours pour changer d'avis" },
  { icon: '✦', title: 'Qualité Premium', sub: 'Matériaux soigneusement sélectionnés' },
];
