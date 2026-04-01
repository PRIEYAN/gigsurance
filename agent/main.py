import json

from ai_analysis import AI_analysis


def process_weekly_payouts(assessed_data):
    print("\n=== Initiating Weekly Payout Settlement ===")

    disruption_tally = {}
    for day in assessed_data.get("evaluations", []):
        for region, assessment in day.get("region_assessments", {}).items():
            if region not in disruption_tally:
                disruption_tally[region] = 0
            if assessment.get("is_disruption") is True:
                disruption_tally[region] += 1

    try:
        with open("active_policies.json", "r", encoding="utf-8") as f:
            active_policies = json.load(f)
    except FileNotFoundError:
        print("Error: active_policies.json not found. Please create the file.")
        return

    total_payout_pool = 0
    successful_transactions = 0

    for worker in active_policies:
        worker_region = worker["region"]
        days_lost = disruption_tally.get(worker_region, 0)

        if days_lost > 0:
            payout_amount = days_lost * worker["daily_coverage"]
            total_payout_pool += payout_amount
            successful_transactions += 1

            print(f"✅ Initiating transfer to {worker['worker_id']} ({worker['name']})")
            print(f"   Reason: {days_lost} disruption days in {worker_region}.")
            print(f"   Amount: ₹{payout_amount} (Plan: {worker['plan']} at ₹{worker['daily_coverage']}/day)")
            print(f"   Status: SUCCESS - Ref: TXN-{worker['worker_id']}-998\n")
        else:
            print(f"⏭️ Skipping {worker['worker_id']} ({worker['name']}) - No valid disruptions in {worker_region} this week.")

    print("-" * 50)
    print("=== Weekly Settlement Complete ===")
    print(f"Total Workers Compensated: {successful_transactions}")
    print(f"Total Funds Disbursed: ₹{total_payout_pool}")
    print("-" * 50)


if __name__ == "__main__":
    ai_output = AI_analysis()
    if ai_output is not None:
        process_weekly_payouts(ai_output)
