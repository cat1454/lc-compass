// Review probes only; no application/content changes. Run from web:
// node_modules/.bin/tsx.cmd ../delivery/qa/review-00-01-probes.ts
import fs from 'node:fs';
import { validateContentCard, calculateAvailability, toPublicCardDTO, validateCardCollection } from '../../web/src/contracts/validator';
import { ContentCardSchema, PublicCardDTOSchema } from '../../web/src/contracts/card';
import { ResearchResponseSchema } from '../../web/src/contracts/research';

const fixture = JSON.parse(fs.readFileSync(new URL('../../web/fixtures/cards.fixture.json', import.meta.url), 'utf8'));
const now = new Date('2026-09-18T12:00:00Z');
const make = () => ({ ...structuredClone(fixture[0]), isSynthetic: false });
const results: Record<string, unknown> = {};
let card = make(); card.review.status = 'review'; delete card.review.reviewer; delete card.review.reviewedAt;
results.review_status_available = calculateAvailability(ContentCardSchema.parse(card), now);
card = make(); card.review.reviewDue = '2026-99-99';
results.invalid_date = {accepted: validateContentCard(card,{isPublishedTarget:true}).valid, availability: calculateAvailability(ContentCardSchema.parse(card), now)};
card = make(); card.body.steps[0].claimIds = ['does-not-exist'];
results.dangling_claim_accepted = validateContentCard(card,{isPublishedTarget:true}).valid;
card = make(); card.body.claimsWithSources=[]; card.body.steps.forEach((s:any)=>s.claimIds=[]);
results.unsourced_steps_accepted = validateContentCard(card,{isPublishedTarget:true}).valid;
card = make(); card.review.status='withdrawn';
results.withdrawn_public_body = !!toPublicCardDTO(ContentCardSchema.parse(card),now).body;
results.synthetic_verified = toPublicCardDTO(ContentCardSchema.parse(fixture[0]),now).review.isVerified;
const dto = toPublicCardDTO(ContentCardSchema.parse(make()),now);
results.mismatched_public_type_accepted = PublicCardDTOSchema.safeParse({...dto,type:'PLACE'}).success;
results.ok_without_citations_accepted = ResearchResponseSchema.safeParse({status:'ok',answer:'unsupported answer',retrievedAt:now.toISOString()}).success;
card=make(); const other=make();
results.cross_file_validation_pattern = {fileA:validateCardCollection([card],{isPublishedTarget:true}).valid,fileB:validateCardCollection([other],{isPublishedTarget:true}).valid,combined:validateCardCollection([card,other],{isPublishedTarget:true}).valid};
const branching=make(); branching.body.steps[0].branches=[{when:{questionId:'housing',equals:'unknown'},nextStepId:'step-3'}];
const parsed=ContentCardSchema.parse(branching);
results.branch_field_survives_schema = 'branches' in parsed.body.steps[0];
console.log(JSON.stringify(results,null,2));
