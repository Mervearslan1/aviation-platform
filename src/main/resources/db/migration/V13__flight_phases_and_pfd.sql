-- Kısa uçuş senaryolarına taksi / rotate / flare fazları ve PFD enstrüman durumu.

UPDATE training_simulations
SET description = 'Park freni, taksi, flap, tam gaz, rotate, tırmanış, final, flare. Yanlış flap/hızda stall.',
    config = $json${
  "controls": {"C172-024":"ON","C172-007":"0","C172-004":"IDLE"},
  "flight": {"phase":"PARKED","ias":0,"altitude":0,"pitch":0,"roll":0,"vs":0,"heading":270,"gear":"FIXED","onGround":true,"n1":18},
  "expected": [
    {"part":"C172-024","value":"OFF","hint":"Park frenini bırak, taksiye hazır ol.","flight":{"phase":"TAXI","ias":12,"n1":28,"heading":280}},
    {"part":"C172-010","value":"CENTER","hint":"Taksi: dümen ile merkeze al, hold short'a ilerle.","flight":{"phase":"TAXI","ias":14,"heading":270}},
    {"part":"C172-007","value":"10","hint":"Pist hizasında kalkış flap 10.","flight":{"phase":"LINEUP","ias":0,"n1":22,"heading":270}},
    {"part":"C172-004","value":"FULL","hint":"Tam gaz — kalkış koşusu, hız artsın.","flight":{"phase":"TAKEOFF_ROLL","ias":55,"n1":100,"heading":270}},
    {"part":"C172-009","value":"BACK","hint":"Vr: yoke hafif geri — rotate.","flight":{"phase":"ROTATE","ias":60,"altitude":15,"pitch":8,"onGround":false,"vs":400,"n1":100}},
    {"part":"C172-007","value":"0","hint":"Pozitif tırmanışta flap yukarı.","flight":{"phase":"CLIMB","ias":75,"altitude":800,"pitch":7,"vs":700,"n1":90}},
    {"part":"C172-007","value":"20","hint":"Final: flap 20, hızı düşür.","flight":{"phase":"APPROACH","ias":70,"altitude":400,"pitch":2,"vs":-450,"n1":45,"heading":270}},
    {"part":"C172-004","value":"IDLE","hint":"Yere yakın gaz kes, flare.","flight":{"phase":"FLARE","ias":52,"altitude":15,"pitch":6,"vs":-150,"n1":18}},
    {"part":"C172-009","value":"HOLD","hint":"Burun yukarı tut, teker koy, iniş.","flight":{"phase":"LANDING","ias":0,"altitude":0,"pitch":2,"vs":0,"onGround":true,"n1":18}}
  ],
  "crash": [
    {"when":{"C172-004":"IDLE","C172-007":"0"},"message":"Finalde flapsız ve gaz kesik. Stall — uçak düştü.","flight":{"phase":"CRASHED","ias":40,"altitude":80,"pitch":-22,"roll":-18,"vs":-1800,"onGround":false,"n1":18}},
    {"when":{"C172-024":"ON","C172-004":"FULL"},"message":"Park freni açıkken tam gaz. Lastik dumanı — CRASH.","flight":{"phase":"CRASHED","ias":0,"altitude":0,"pitch":0,"onGround":true,"n1":100}}
  ]
}$json$::jsonb
WHERE code = 'C172-SHORT-CIRCUIT';

UPDATE training_simulations
SET config = jsonb_set(
        config,
        '{flight}',
        '{"phase":"PARKED","ias":0,"altitude":0,"pitch":0,"roll":0,"vs":0,"heading":270,"gear":"FIXED","onGround":true,"n1":0}'::jsonb
    )
WHERE code = 'C172-COLD-START';

UPDATE training_simulations
SET description = 'Taksi, flap, TOGA, rotate, gear up, yaklaşma, flare. Yerde gear up ve düşük itki stall düşürür.',
    config = $json${
  "controls": {"B737-032":"ON","B737-039":"DOWN","B737-030":"0","B737-028":"IDLE"},
  "flight": {"phase":"PARKED","ias":0,"altitude":0,"pitch":0,"roll":0,"vs":0,"heading":90,"gear":"DOWN","onGround":true,"n1":20},
  "expected": [
    {"part":"B737-032","value":"OFF","hint":"Park freni OFF, taksi.","flight":{"phase":"TAXI","ias":16,"n1":32,"heading":100}},
    {"part":"B737-038","value":"CENTER","hint":"Taksi: rudder / nose-wheel merkeze.","flight":{"phase":"TAXI","ias":18,"heading":90}},
    {"part":"B737-030","value":"5","hint":"Pist hizası: kalkış flap 5.","flight":{"phase":"LINEUP","ias":0,"n1":24,"heading":90}},
    {"part":"B737-028","value":"TOGA","hint":"Takeoff thrust — kalkış koşusu.","flight":{"phase":"TAKEOFF_ROLL","ias":80,"n1":98}},
    {"part":"B737-035","value":"BACK","hint":"Vr: yoke geri — rotate.","flight":{"phase":"ROTATE","ias":145,"altitude":30,"pitch":10,"onGround":false,"vs":600,"n1":98,"gear":"DOWN"}},
    {"part":"B737-039","value":"UP","hint":"Pozitif rate, gear up.","flight":{"phase":"CLIMB","ias":180,"altitude":1500,"pitch":12,"vs":1800,"n1":90,"gear":"UP"}},
    {"part":"B737-039","value":"DOWN","hint":"Finalde gear down.","flight":{"phase":"APPROACH","ias":150,"altitude":1200,"pitch":3,"vs":-700,"n1":55,"gear":"DOWN"}},
    {"part":"B737-030","value":"30","hint":"İniş flap 30.","flight":{"phase":"APPROACH","ias":140,"altitude":600,"pitch":2,"vs":-650,"n1":52}},
    {"part":"B737-028","value":"IDLE","hint":"Eşikte itki idle, flare.","flight":{"phase":"FLARE","ias":132,"altitude":25,"pitch":5,"vs":-200,"n1":28}},
    {"part":"B737-035","value":"HOLD","hint":"Burun tut, main gear, iniş.","flight":{"phase":"LANDING","ias":0,"altitude":0,"pitch":1,"vs":0,"onGround":true,"n1":28,"gear":"DOWN"}}
  ],
  "crash": [
    {"when":{"B737-039":"UP","onGround":true},"message":"Yerde landing gear UP. Burun çöktü — CRASH.","flight":{"phase":"CRASHED","ias":0,"altitude":0,"pitch":-8,"onGround":true,"gear":"UP","n1":20}},
    {"when":{"B737-039":"UP","B737-028":"IDLE"},"message":"Düşük itki ve gear up düşük irtifada. Stall — düştü.","flight":{"phase":"CRASHED","ias":110,"altitude":200,"pitch":-20,"roll":12,"vs":-2200,"onGround":false,"gear":"UP","n1":28}},
    {"when":{"B737-032":"ON","B737-028":"TOGA"},"message":"Park freni ON iken TOGA. Lastikler ve kuyruk — CRASH.","flight":{"phase":"CRASHED","ias":0,"altitude":0,"pitch":0,"onGround":true,"n1":98}}
  ]
}$json$::jsonb
WHERE code = 'B737-SHORT-FLIGHT';

UPDATE training_simulations
SET config = jsonb_set(
        config,
        '{flight}',
        '{"phase":"PARKED","ias":0,"altitude":0,"pitch":0,"roll":0,"vs":0,"heading":90,"gear":"DOWN","onGround":true,"n1":0}'::jsonb
    )
WHERE code = 'B737-COLD-START';

UPDATE training_simulations
SET description = 'Taksi, 1+F, FLX, rotate, gear, full flap, flare. Yanlış konfigürasyon düşürür.',
    config = $json${
  "controls": {"A350-029":"ON","A350-037":"DOWN","A350-028":"0","A350-026":"IDLE"},
  "flight": {"phase":"PARKED","ias":0,"altitude":0,"pitch":0,"roll":0,"vs":0,"heading":90,"gear":"DOWN","onGround":true,"n1":20},
  "expected": [
    {"part":"A350-029","value":"OFF","hint":"Park freni OFF, taksi.","flight":{"phase":"TAXI","ias":14,"n1":30,"heading":98}},
    {"part":"A350-036","value":"CENTER","hint":"Taksi: pedallar merkeze.","flight":{"phase":"TAXI","ias":16,"heading":90}},
    {"part":"A350-028","value":"1+F","hint":"Pist hizası: kalkış flap/slat 1+F.","flight":{"phase":"LINEUP","ias":0,"n1":24,"heading":90}},
    {"part":"A350-026","value":"FLX","hint":"Kalkış itki FLX — kalkış koşusu.","flight":{"phase":"TAKEOFF_ROLL","ias":85,"n1":92}},
    {"part":"A350-034","value":"BACK","hint":"Vr: side-stick geri — rotate.","flight":{"phase":"ROTATE","ias":155,"altitude":35,"pitch":12,"onGround":false,"vs":700,"n1":92,"gear":"DOWN"}},
    {"part":"A350-037","value":"UP","hint":"Positive climb, gear up.","flight":{"phase":"CLIMB","ias":185,"altitude":1600,"pitch":12,"vs":2000,"n1":88,"gear":"UP"}},
    {"part":"A350-037","value":"DOWN","hint":"Final gear down.","flight":{"phase":"APPROACH","ias":155,"altitude":1300,"pitch":3,"vs":-750,"n1":52,"gear":"DOWN"}},
    {"part":"A350-028","value":"FULL","hint":"İniş flap full.","flight":{"phase":"APPROACH","ias":142,"altitude":650,"pitch":2,"vs":-700,"n1":50}},
    {"part":"A350-026","value":"IDLE","hint":"Eşikte idle, flare.","flight":{"phase":"FLARE","ias":135,"altitude":30,"pitch":6,"vs":-180,"n1":26}},
    {"part":"A350-034","value":"HOLD","hint":"Side-stick ile burun tut, iniş.","flight":{"phase":"LANDING","ias":0,"altitude":0,"pitch":1,"vs":0,"onGround":true,"n1":26,"gear":"DOWN"}}
  ],
  "crash": [
    {"when":{"A350-037":"UP","onGround":true},"message":"Yerde gear up. Airbus da yerçekimine yenik — CRASH.","flight":{"phase":"CRASHED","ias":0,"altitude":0,"pitch":-8,"onGround":true,"gear":"UP","n1":20}},
    {"when":{"A350-026":"IDLE","A350-028":"0"},"message":"Yapılandırılmamış alçalış. Stall — düştü.","flight":{"phase":"CRASHED","ias":120,"altitude":250,"pitch":-18,"roll":-10,"vs":-2000,"onGround":false,"n1":26}}
  ]
}$json$::jsonb
WHERE code = 'A350-SHORT-FLIGHT';

UPDATE training_simulations
SET config = jsonb_set(
        config,
        '{flight}',
        '{"phase":"PARKED","ias":0,"altitude":0,"pitch":0,"roll":0,"vs":0,"heading":90,"gear":"DOWN","onGround":true,"n1":0}'::jsonb
    )
WHERE code = 'A350-COLD-START';
