<?php 
    include('./session.php');
    include('./assets/connection.php');
    

    $webservice = "http://192.168.42.10:8081/EmpPortal.asmx?wsdl";
    $param = array("bioID" => 3858);
    $soap = new SOAPClient($webservice);
    $result = $soap->GetEmployee($param)->GetEmployeeResult;
    // echo "<pre>"; print_r($result); echo "</pre>";


    // select all
    $sql = "SELECT * FROM job_order_assigned_techs";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $admin_users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // extract only the techBioID values
    // $admin_users = array_column($admin_users, 'techBioID');

    echo "<pre>"; print_r($admin_users); echo "</pre>";
    // echo "<pre>"; print_r($_SESSION); echo "</pre>";

    // #2b1b16
    // #432b23
    // #5a4038
    // #211512



    // Prismatic cake: 1 banana + 4 bone blossoms
    // Prismatic hotdog: 1 corn + 4 bone blossoms
    // Prismatic salad: 1 tomato + 4 bone blossoms
    // Prismatic donut: 1 sugar glaze + 4 bone blossoms
    // Prismatic pie: 1 pumpkin + 4 bone blossoms
    // Prismatic Ice Cream : 1 banana + 1 sugar apple + 3 bone blossom
    // Prismatic Pizza : 1 Sugar apple + 1 Violet corn + 3 Bone blossom

?>
<!-- 
Honestly — those colors (#2b1b16, #432b23, #5a4038, #211512) give off a dark brown / earthy tone, which can feel a bit muted, heavy, or “muddy” when used together, especially for dashboards or data-heavy UIs.

They’re not objectively ugly — they just lean toward a vintage / rustic / coffee-inspired palette rather than something that feels modern, clean, or professional (which is what departments like Engineering usually expect).

Let’s break it down:

🎨 What Your Current Palette Feels Like

Pros: Warm, consistent, unique, not harsh on the eyes.

Cons: Low contrast → text and charts may lack clarity.
It doesn’t “pop,” especially if paired with muted text or flat charts.

✅ Suggestions (Without Losing Your Identity)

If you want to keep your warm tone but make it look more modern and professional, try adding complementary highlights or slightly adjusting the hues:

Option 1 — Warm Modern

Primary background: #2b1b16 (keep it dark)

Accent 1 (cards, highlights): #8B5E3C

Accent 2 (buttons, icons): #D4A373

Text (light): #F4EDE4
→ Gives a coffee + modern office feel.

Option 2 — Engineering-Professional (Earth + Steel)

Background: #1E1E1E

Card: #2C1F19

Accent 1: #E09F3E (amber-orange)

Accent 2: #9E2A2B (rust red)

Accent 3: #94D2BD (mint teal)
→ Still warm, but has contrast and looks more "tech + earthy".

Option 3 — Minimal Dark (Elegant)

Background: #1B1B1B

Card: #2E2E2E

Accent: #B8860B (gold-like for highlights)

Text: #EFEFEF
→ Elegant and executive-looking.

If you’d like, I can generate a preview (mockup palette or dashboard sample) using your layout so you can see which variant feels best.
Would you like me to make a quick palette or chart UI sample using your current dashboard style — one with your current colors and one improved? -->


<!--
1. Show the calaculated turn around time based on the target start date and target end date
2. Start Job and Assign Button meshing
3. Assgin Now button requrirements.
-->



        <!-- // if($tech_data['techCategory'] != 'ADMIN'){
        //     // Default: use single category
        //     $categories = [$tech_data['techCategory']];

        //     // Special Case: user allowed to see 2 categories
        //     // EXAMPLE: if bioID = 152 → allow IU + MU
        //     if ($_SESSION['user'] == 3522) {  
        //         $categories = ['MU', 'EU']; 
        //     }

        //     // Add SQL filter
        //     if (count($categories) === 1) {
        //         $sql .= " AND requestCategory = ?";
        //         $params[] = $categories[0];
        //     } else {
        //         // Multiple categories → use IN (...)
        //         $placeholders = implode(',', array_fill(0, count($categories), '?'));
        //         $sql .= " AND requestCategory IN ($placeholders)";
        //         $params = array_merge($params, $categories);
        //     }
        // } -->