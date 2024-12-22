/**
 * CUSTOMERS
 * Note: this is a private table that contains a mapping of user IDs to Stripe customer IDs.
 */
create table customers (
    -- UUID from auth.users
    id uuid references public.users not null primary key,
    -- The user's customer ID in Stripe. User must not be able to update this.
    stripe_customer_id text
);

alter table
    customers enable row level security;

-- No policies as this is a private table that the user must not have access to.
/** 
 * PRODUCTS
 * Note: products are created and managed in Stripe and synced to our DB via Stripe webhooks.
 */
create table products (
    -- Product ID from Stripe, e.g. prod_1234.
    id text primary key,
    -- Whether the product is currently available for purchase.
    active boolean,
    -- The product's name, meant to be displayable to the customer. Whenever this product is sold via a subscription, name will show up on associated invoice line item descriptions.
    name text,
    -- The product's description, meant to be displayable to the customer. Use this field to optionally store a long form explanation of the product being sold for your own rendering purposes.
    description text,
    -- A URL of the product image in Stripe, meant to be displayable to the customer.
    image text,
    -- Set of key-value pairs, used to store additional information about the object in a structured format.
    metadata jsonb
);

alter table
    products enable row level security;

create policy "Allow public read-only access." on products for
select
    using (true);

/**
 * PRICES
 * Note: prices are created and managed in Stripe and synced to our DB via Stripe webhooks.
 */
create table prices (
    -- Price ID from Stripe, e.g. price_1234.
    id text primary key,
    -- The ID of the prduct that this price belongs to.
    product_id text references products,
    -- Whether the price can be used for new purchases.
    active boolean,
    -- A brief description of the price.
    description text,
    -- The unit amount as a positive integer in the smallest currency unit (e.g., 100 cents for US$1.00 or 100 for ¥100, a zero-decimal currency).
    unit_amount bigint,
    -- Three-letter ISO currency code, in lowercase.
    currency text check (char_length(currency) = 3),
    -- Set of key-value pairs, used to store additional information about the object in a structured format.
    metadata jsonb
);

alter table
    prices enable row level security;

create policy "Allow public read-only access." on prices for
select
    using (true);

/**
 * REALTIME SUBSCRIPTIONS
 * Only allow realtime listening on public tables.
 */
drop publication if exists supabase_realtime;

create publication supabase_realtime for table products,
prices;