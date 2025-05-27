const toysProducts = [
  // --------- Labubu Products ---------
  {
    name: 'THE MONSTERS COCA-COLA SERIES-Vinyl Face Blind Box',
    group: 'labubu',
    defaultImg: 'https://prod-thailand-res.popmart.com/default/20241218_164243_708358____4_____1200x1200.jpg',
    options: [
      {
        name: 'One box',
        price: 850.00,
        img: 'https://prod-thailand-res.popmart.com/default/20241217_162840_812230____9_____1200x1200.jpg'
      },
      {
        name: 'Whole set',
        price: 5100.00,
        img: 'https://prod-thailand-res.popmart.com/default/20241218_164243_406039____10_____1200x1200.jpg'
      }
    ]
  },
  {
    name: 'THE MONSTERS Big into Energy Series-Vinyl Plush Pendant Blind Box',
    group: 'labubu',
    defaultImg: 'https://prod-thailand-res.popmart.com/default/20250423_174436_941417____list_pic_____800x800.png?x-oss-process=image/resize,p_40,format,webp,format,webp',
    options: [
      {
        name: 'One box',
        price: 550.00,
        img: 'https://prod-thailand-res.popmart.com/default/20250422_111824_313365____8_____1200x1200.jpg'
      },
      {
        name: 'Whole set',
        price: 3300.00,
        img: 'https://prod-thailand-res.popmart.com/default/20250422_111834_010240____9_____1200x1200.jpg'
      }
    ]
  },
  {
    name: 'MEGA LABUBU TONY TONY CHOPPER',
    group: 'labubu',
    defaultImg: 'https://prod-eurasian-res.popmart.com/default/20250409_155117_300134____1_____1200x1200.jpg',
    options: [
      {
        name: '400%',
        price: 6790.00,
        img: 'https://prod-eurasian-res.popmart.com/default/20250409_155205_828277_____08_____1200x1598.jpg?x-oss-process=image/format,webp'
      },
      {
        name: '1000%',
        price: 31900.00,
        img: 'https://prod-eurasian-res.popmart.com/default/20250409_155205_828277_____08_____1200x1598.jpg?x-oss-process=image/format,webp'
      }
    ]
  },
  {
    name: 'THE MONSTERS How to Train Your Dragon Figurine',
    group: 'labubu',
    defaultImg: 'https://prod-thailand-res.popmart.com/default/20240806_094517_965467____1_____1200x1200.jpg',
    options: [
      {
        name: '1 pcs',
        price: 3690.00,
        img: 'https://prod-thailand-res.popmart.com/default/20240806_094517_965467____1_____1200x1200.jpg'
      }
    ]
  },

  // --------- Hirono Products ---------
  {
    name: 'HIRONO X KEITH HARING 200%',
    group: 'hirono',
    defaultImg: 'https://gh.lnwfile.com/_webp_max_images/600/600/46/ch/uy.webp',
    options: [
      {
        name: '1 pcs',
        price: 3690.00,
        img: 'https://gh.lnwfile.com/_webp_max_images/600/600/46/ch/uy.webp'
      }
    ]
  },
  {
    name: 'Hirono × Snoopy Figure',
    group: 'hirono',
    defaultImg: 'https://prod-eurasian-res.popmart.com/default/20250408_175815_105043____1_____1200x1200.jpg',
    options: [
      {
        name: '1 pcs',
        price: 1050.00,
        img: 'https://prod-eurasian-res.popmart.com/default/20250408_175815_105043____1_____1200x1200.jpg'
      }
    ]
  },
  {
    name: 'Hirono Doll Panda Figure',
    group: 'hirono',
    defaultImg: 'https://prod-thailand-res.popmart.com/default/20241022_162121_045414____1_____1200x1200.jpg',
    options: [
      {
        name: '1 pcs',
        price: 1050.00,
        img: 'https://prod-thailand-res.popmart.com/default/20241022_162121_045414____1_____1200x1200.jpg'
      }
    ]
  },
  {
    name: 'Hirono Doll Panda Figure',
    group: 'hirono',
    defaultImg: 'https://prod-thailand-res.popmart.com/default/20240718_112611_563416____list_pic_____800x800.png?x-oss-process=image/resize,p_40,format,webp,format,webp',
    options: [
      {
        name: 'One box',
        price: 380.00,
        img: 'https://prod-thailand-res.popmart.com/default/20240715_095503_997904_________1200x1200.jpg'
      },
      {
        name: 'Whole set',
        price: 4560.00,
        img: 'https://prod-thailand-res.popmart.com/default/20240715_095521_842985_________1200x1200.jpg'
      }
    ]
  },
  {
    name: 'Hirono × CLOT Series Figures (Gift Box Edition)',
    group: 'hirono',
    defaultImg: 'https://prod-thailand-res.popmart.com/default/20241212_110706_925013____img_v3_02hg_0a9d5b6f-9f87-4f65-b24c-1388421983ag_____1200x1200.jpg',
    options: [
      {
        name: '1 pcs',
        price: 3190.00,
        img: 'https://prod-thailand-res.popmart.com/default/20241212_110706_925013____img_v3_02hg_0a9d5b6f-9f87-4f65-b24c-1388421983ag_____1200x1200.jpg'
      }
    ]
  },

  // --------- Dimoo Products ---------
  {
    name: 'Mega Just Dimoo 400% Mickey Mouse',
    group: 'dimoo',
    defaultImg: 'https://d2cva83hdk3bwc.cloudfront.net/PM-FGCPMMJD4MMMHLD-pop-mart-mega-just-dimoo-400-mickey-mouse-1.jpg',
    options: [
      {
        name: '1 pcs',
        price: 6780.00,
        img: 'https://d2cva83hdk3bwc.cloudfront.net/PM-FGCPMMJD4MMMHLD-pop-mart-mega-just-dimoo-400-mickey-mouse-1.jpg'
      }
    ]
  },

  // --------- Molly Products ---------
  {
    name: 'MEGA SPACE MOLLY 1000% Jon Burgerman',
    group: 'molly',
    defaultImg: 'https://prod-eurasian-res.popmart.com/default/20250417_145424_251918____1_____1200x1200.jpg',
    options: [
      {
        name: '1 pcs',
        price: 31900.00,
        img: 'https://prod-eurasian-res.popmart.com/default/20250417_145424_251918____1_____1200x1200.jpg'
      }
    ]
  }
];

export default toysProducts;
