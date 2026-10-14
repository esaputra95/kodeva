-- Local-only fixture data. Never run this against the hosted demo project.
insert into public.leads (
  submission_id, name, email, whatsapp, campaign_id, utm, landing_path
)
values
  (
    '1a0a0a01-1111-4111-8111-111111111111',
    'Rina Demo',
    'rina@example.com',
    null,
    'launch-kodeva',
    '{"utm":{"utm_source":"instagram","utm_medium":"social","utm_campaign":"launch-kodeva","utm_term":"","utm_content":""},"campaignId":"launch-kodeva","entryPath":"/?utm_source=instagram&utm_medium=social&utm_campaign=launch-kodeva","capturedAt":"2026-10-10T10:00:00.000Z"}'::jsonb,
    '/'
  ),
  (
    '2b0b0b02-2222-4222-8222-222222222222',
    'Bima Demo',
    null,
    '+6281234567890',
    'launch-kodeva',
    '{"utm":{"utm_source":"google","utm_medium":"cpc","utm_campaign":"launch-kodeva","utm_term":"kasir","utm_content":"brand-search"},"campaignId":"launch-kodeva","entryPath":"/products?utm_source=google&utm_medium=cpc&utm_campaign=launch-kodeva","capturedAt":"2026-10-10T11:00:00.000Z"}'::jsonb,
    '/products'
  )
on conflict (submission_id) do nothing;
