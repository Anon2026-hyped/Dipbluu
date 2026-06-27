-- All pricing is now USD-only. Remove the NGN kobo column from print_options.
alter table print_options drop column if exists price_ngn_kobo;
