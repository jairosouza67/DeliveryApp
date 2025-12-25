// Script para popular o banco de dados com bebidas
// Execute com: npx tsx scripts/seed-products.ts

import { createClient } from '@supabase/supabase-js';

// Using user's actual Supabase credentials from .env
const SUPABASE_URL = 'https://hcgntbskqevibpehyvrr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjZ250YnNrcWV2aWJwZWh5dnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2Nzg2ODUsImV4cCI6MjA4MjI1NDY4NX0.fw3Ko-4YHG9NqK25tUPrrLvPeLCVbJW5H6pe3G7cwGo';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const beverages = [
    // CERVEJAS
    { 
        name: 'Heineken Lata 350ml', 
        type: 'Cervejas', 
        price: 5.99, 
        in_stock: true, 
        description: 'Cerveja Heineken Pilsen lata 350ml',
        image_url: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop'
    },
    { 
        name: 'Heineken Long Neck 330ml', 
        type: 'Cervejas', 
        price: 7.49, 
        in_stock: true, 
        description: 'Cerveja Heineken Pilsen long neck',
        image_url: 'https://images.unsplash.com/photo-1618885472179-5e474019f2a9?w=400&h=400&fit=crop'
    },
    { 
        name: 'Budweiser Lata 350ml', 
        type: 'Cervejas', 
        price: 4.99, 
        in_stock: true, 
        description: 'Cerveja Budweiser American Lager',
        image_url: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&h=400&fit=crop'
    },
    { 
        name: 'Brahma Duplo Malte 350ml', 
        type: 'Cervejas', 
        price: 3.99, 
        in_stock: true, 
        description: 'Cerveja Brahma Duplo Malte lata',
        image_url: 'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=400&h=400&fit=crop'
    },
    { 
        name: 'Skol Lata 350ml', 
        type: 'Cervejas', 
        price: 3.49, 
        in_stock: true, 
        description: 'Cerveja Skol Pilsen lata',
        image_url: 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?w=400&h=400&fit=crop'
    },
    { 
        name: 'Corona Extra 330ml', 
        type: 'Cervejas', 
        price: 8.99, 
        in_stock: true, 
        description: 'Cerveja Corona Extra long neck',
        image_url: 'https://images.unsplash.com/photo-1628557044797-f21a177c37ec?w=400&h=400&fit=crop'
    },
    { 
        name: 'Stella Artois 275ml', 
        type: 'Cervejas', 
        price: 6.99, 
        in_stock: true, 
        description: 'Cerveja Stella Artois Premium',
        image_url: 'https://images.unsplash.com/photo-1533119408463-b0f487583ff6?w=400&h=400&fit=crop'
    },
    { 
        name: 'Original 600ml', 
        type: 'Cervejas', 
        price: 9.99, 
        in_stock: true, 
        description: 'Cerveja Original garrafa 600ml',
        image_url: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&h=400&fit=crop'
    },
    { 
        name: 'Amstel Lata 350ml', 
        type: 'Cervejas', 
        price: 4.49, 
        in_stock: true, 
        description: 'Cerveja Amstel Pilsen lata',
        image_url: 'https://images.unsplash.com/photo-1600788886242-5c96aabe3757?w=400&h=400&fit=crop'
    },
    { 
        name: 'Eisenbahn Pilsen 355ml', 
        type: 'Cervejas', 
        price: 7.99, 
        in_stock: true, 
        description: 'Cerveja Eisenbahn Pilsen long neck',
        image_url: 'https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=400&h=400&fit=crop'
    },
    { 
        name: 'Colorado Appia 600ml', 
        type: 'Cervejas', 
        price: 19.90, 
        in_stock: true, 
        description: 'Cerveja Colorado Appia - Trigo com Mel',
        image_url: 'https://images.unsplash.com/photo-1619410283995-43d9134e7656?w=400&h=400&fit=crop'
    },
    { 
        name: 'Petra Origem 600ml', 
        type: 'Cervejas', 
        price: 14.90, 
        in_stock: true, 
        description: 'Cerveja Petra Origem Puro Malte',
        image_url: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=400&fit=crop'
    },

    // VINHOS
    { 
        name: 'Casillero del Diablo Cabernet', 
        type: 'Vinhos', 
        price: 54.90, 
        in_stock: true, 
        description: 'Vinho Chileno Casillero del Diablo Cabernet Sauvignon 750ml',
        image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=400&fit=crop'
    },
    { 
        name: 'Santa Helena Reservado Merlot', 
        type: 'Vinhos', 
        price: 39.90, 
        in_stock: true, 
        description: 'Vinho Chileno Santa Helena Merlot 750ml',
        image_url: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&h=400&fit=crop'
    },
    { 
        name: 'Almadén Tinto Suave 750ml', 
        type: 'Vinhos', 
        price: 24.90, 
        in_stock: true, 
        description: 'Vinho Brasileiro Almadén Tinto Suave',
        image_url: 'https://images.unsplash.com/photo-1586370434639-0fe43b2d32e6?w=400&h=400&fit=crop'
    },
    { 
        name: 'Sangue de Boi 1L', 
        type: 'Vinhos', 
        price: 18.90, 
        in_stock: true, 
        description: 'Vinho Tinto Suave Sangue de Boi',
        image_url: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=400&h=400&fit=crop'
    },
    { 
        name: 'Periquita Tinto 750ml', 
        type: 'Vinhos', 
        price: 49.90, 
        in_stock: true, 
        description: 'Vinho Português Periquita Tinto',
        image_url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=400&fit=crop'
    },
    { 
        name: 'Chandon Brut 750ml', 
        type: 'Vinhos', 
        price: 89.90, 
        in_stock: true, 
        description: 'Espumante Chandon Brut 750ml',
        image_url: 'https://images.unsplash.com/photo-1594372365401-3b5ff14eaaed?w=400&h=400&fit=crop'
    },
    { 
        name: 'Salton Prosecco 750ml', 
        type: 'Vinhos', 
        price: 44.90, 
        in_stock: true, 
        description: 'Espumante Salton Prosecco Brut',
        image_url: 'https://images.unsplash.com/photo-1592483648228-b35146a4330c?w=400&h=400&fit=crop'
    },
    { 
        name: 'Miolo Seleção Rosé 750ml', 
        type: 'Vinhos', 
        price: 34.90, 
        in_stock: true, 
        description: 'Vinho Rosé Miolo Seleção',
        image_url: 'https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?w=400&h=400&fit=crop'
    },

    // DESTILADOS
    { 
        name: 'Absolut Vodka 1L', 
        type: 'Destilados', 
        price: 89.90, 
        in_stock: true, 
        description: 'Vodka Absolut Original 1 litro',
        image_url: 'https://images.unsplash.com/photo-1608885898957-a559228e8749?w=400&h=400&fit=crop'
    },
    { 
        name: 'Smirnoff Vodka 998ml', 
        type: 'Destilados', 
        price: 44.90, 
        in_stock: true, 
        description: 'Vodka Smirnoff Triple Destilled',
        image_url: 'https://images.unsplash.com/photo-1614313511387-1436a4480ebb?w=400&h=400&fit=crop'
    },
    { 
        name: 'Tanqueray London Dry 750ml', 
        type: 'Destilados', 
        price: 119.90, 
        in_stock: true, 
        description: 'Gin Tanqueray London Dry',
        image_url: 'https://images.unsplash.com/photo-1609951651556-5334e2706168?w=400&h=400&fit=crop'
    },
    { 
        name: 'Beefeater Gin 750ml', 
        type: 'Destilados', 
        price: 99.90, 
        in_stock: true, 
        description: 'Gin Beefeater London Dry',
        image_url: 'https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=400&h=400&fit=crop'
    },
    { 
        name: 'Jack Daniels 1L', 
        type: 'Destilados', 
        price: 169.90, 
        in_stock: true, 
        description: 'Whisky Jack Daniels Tennessee 1L',
        image_url: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400&h=400&fit=crop'
    },
    { 
        name: 'Johnnie Walker Red Label 1L', 
        type: 'Destilados', 
        price: 109.90, 
        in_stock: true, 
        description: 'Whisky Johnnie Walker Red Label',
        image_url: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&h=400&fit=crop'
    },
    { 
        name: 'Bacardi White 980ml', 
        type: 'Destilados', 
        price: 49.90, 
        in_stock: true, 
        description: 'Rum Bacardi Carta Blanca',
        image_url: 'https://images.unsplash.com/photo-1598018553943-cee3c66fe022?w=400&h=400&fit=crop'
    },
    { 
        name: '51 Pirassununga 965ml', 
        type: 'Destilados', 
        price: 14.90, 
        in_stock: true, 
        description: 'Cachaça 51 Pirassununga',
        image_url: 'https://images.unsplash.com/photo-1551751299-1b51cab2694c?w=400&h=400&fit=crop'
    },
    { 
        name: 'Ypióca Prata 965ml', 
        type: 'Destilados', 
        price: 19.90, 
        in_stock: true, 
        description: 'Cachaça Ypióca Prata',
        image_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop'
    },

    // DRINKS & ENERGÉTICOS
    { 
        name: 'Red Bull 250ml', 
        type: 'Drinks', 
        price: 9.99, 
        in_stock: true, 
        description: 'Energético Red Bull lata 250ml',
        image_url: 'https://images.unsplash.com/photo-1613477632879-c67c7dbb8f1c?w=400&h=400&fit=crop'
    },
    { 
        name: 'Monster Energy 473ml', 
        type: 'Drinks', 
        price: 9.49, 
        in_stock: true, 
        description: 'Energético Monster Energy lata',
        image_url: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=400&h=400&fit=crop'
    },
    { 
        name: 'Smirnoff Ice 275ml', 
        type: 'Drinks', 
        price: 7.99, 
        in_stock: true, 
        description: 'Bebida Mista Smirnoff Ice',
        image_url: 'https://images.unsplash.com/photo-1582106245752-2b7f0f0b6264?w=400&h=400&fit=crop'
    },
    { 
        name: 'Mike\'s Hard Lemonade 275ml', 
        type: 'Drinks', 
        price: 8.99, 
        in_stock: true, 
        description: 'Bebida Mike\'s Ice Limão',
        image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=400&fit=crop'
    },
    { 
        name: 'Catuaba Selvagem 1L', 
        type: 'Drinks', 
        price: 12.90, 
        in_stock: true, 
        description: 'Catuaba Selvagem garrafa 1L',
        image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=400&fit=crop'
    },
    { 
        name: 'Aperol 750ml', 
        type: 'Drinks', 
        price: 69.90, 
        in_stock: true, 
        description: 'Aperol Aperitivo Italiano',
        image_url: 'https://images.unsplash.com/photo-1609951651556-5334e2706168?w=400&h=400&fit=crop'
    },

    // REFRIGERANTES & SUCOS
    { 
        name: 'Coca-Cola 2L', 
        type: 'Refrigerantes', 
        price: 10.99, 
        in_stock: true, 
        description: 'Refrigerante Coca-Cola garrafa 2L',
        image_url: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop'
    },
    { 
        name: 'Coca-Cola Lata 350ml', 
        type: 'Refrigerantes', 
        price: 4.99, 
        in_stock: true, 
        description: 'Refrigerante Coca-Cola lata',
        image_url: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=400&fit=crop'
    },
    { 
        name: 'Guaraná Antarctica 2L', 
        type: 'Refrigerantes', 
        price: 8.99, 
        in_stock: true, 
        description: 'Refrigerante Guaraná Antarctica 2L',
        image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop'
    },
    { 
        name: 'Sprite 2L', 
        type: 'Refrigerantes', 
        price: 9.49, 
        in_stock: true, 
        description: 'Refrigerante Sprite limão 2L',
        image_url: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&h=400&fit=crop'
    },
    { 
        name: 'Água Tônica Schweppes 350ml', 
        type: 'Refrigerantes', 
        price: 4.49, 
        in_stock: true, 
        description: 'Água Tônica Schweppes lata',
        image_url: 'https://images.unsplash.com/photo-1558645836-e44122a743ee?w=400&h=400&fit=crop'
    },
    { 
        name: 'Suco Del Valle Uva 1L', 
        type: 'Refrigerantes', 
        price: 7.99, 
        in_stock: true, 
        description: 'Suco Del Valle Sabor Uva',
        image_url: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&h=400&fit=crop'
    },
    { 
        name: 'Água Mineral com Gás 500ml', 
        type: 'Refrigerantes', 
        price: 3.49, 
        in_stock: true, 
        description: 'Água Mineral com Gás garrafa',
        image_url: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=400&fit=crop'
    },
    { 
        name: 'Gelo Pacote 3kg', 
        type: 'Refrigerantes', 
        price: 9.99, 
        in_stock: true, 
        description: 'Pacote de Gelo 3kg',
        image_url: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=400&h=400&fit=crop'
    },

    // COMBOS
    { 
        name: 'Kit Churrasco - 12 Cervejas', 
        type: 'Combos', 
        price: 49.90, 
        in_stock: true, 
        description: 'Kit com 12 cervejas Skol lata 350ml',
        image_url: 'https://images.unsplash.com/photo-1575367439058-6096bb9cf5e2?w=400&h=400&fit=crop'
    },
    { 
        name: 'Kit Gin Tônica', 
        type: 'Combos', 
        price: 129.90, 
        in_stock: true, 
        description: 'Tanqueray 750ml + 4 Schweppes + 2 Limões',
        image_url: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?w=400&h=400&fit=crop'
    },
    { 
        name: 'Kit Vinho & Queijo', 
        type: 'Combos', 
        price: 89.90, 
        in_stock: true, 
        description: 'Vinho Santa Helena + Tábua de Queijos',
        image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'
    },
    { 
        name: 'Kit Festa 24 Cervejas', 
        type: 'Combos', 
        price: 89.90, 
        in_stock: true, 
        description: '24 cervejas mistas (Heineken, Budweiser, Stella)',
        image_url: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop'
    },
    { 
        name: 'Kit Moscow Mule', 
        type: 'Combos', 
        price: 79.90, 
        in_stock: true, 
        description: 'Smirnoff 998ml + Ginger Beer + 2 Limões + Caneca cobre',
        image_url: 'https://images.unsplash.com/photo-1587223962930-cb7f31384c19?w=400&h=400&fit=crop'
    },

    // Itens com baixo/sem estoque
    { 
        name: 'Brahma Extra Lager 350ml', 
        type: 'Cervejas', 
        price: 4.49, 
        in_stock: true, 
        description: 'Cerveja Brahma Extra Lager - ÚLTIMAS UNIDADES',
        image_url: 'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=400&h=400&fit=crop'
    },
    { 
        name: 'Whisky Chivas 12 anos 1L', 
        type: 'Destilados', 
        price: 229.90, 
        in_stock: false, 
        description: 'Whisky Chivas Regal 12 anos - INDISPONÍVEL',
        image_url: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400&h=400&fit=crop'
    },
];

async function seedProducts() {
    console.log('🍺 Iniciando seed de bebidas com imagens...\n');

    // First, delete existing products
    console.log('🗑️ Limpando produtos existentes...');
    const { error: deleteError } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) {
        console.error('Erro ao limpar produtos:', deleteError.message);
        // Continue anyway to insert products
    } else {
        console.log('✓ Produtos existentes removidos\n');
    }

    // Insert new products
    console.log('📦 Inserindo bebidas com imagens...\n');

    let successCount = 0;
    let errorCount = 0;

    for (const beverage of beverages) {
        const { data, error } = await supabase
            .from('products')
            .insert(beverage)
            .select();

        if (error) {
            console.error(`❌ Erro ao inserir ${beverage.name}:`, error.message);
            errorCount++;
        } else {
            console.log(`✅ ${beverage.name} - R$ ${beverage.price.toFixed(2)} 📷`);
            successCount++;
        }
    }

    console.log(`\n📊 Resumo:`);
    console.log(`   ✅ Sucesso: ${successCount}`);
    console.log(`   ❌ Erros: ${errorCount}`);
    console.log(`\n🎉 Seed concluído com imagens!`);
}

seedProducts();
