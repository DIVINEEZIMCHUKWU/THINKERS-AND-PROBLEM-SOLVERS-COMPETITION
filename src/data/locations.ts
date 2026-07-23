// Countries and States data for registration dropdowns
export const countries = [
  "Nigeria",
  "United Kingdom",
  "Canada",
  "United States",
  "Ireland",
  "Germany",
  "France",
  "Ghana",
  "Kenya",
  "South Africa",
  "Australia"
];

export const nigerianStates: { [key: string]: string[] } = {
  "Abia": ["Aba North", "Aba South", "Arochukwu", "Bende", "Ikwuano", "Isiala Ngwa North", "Isiala Ngwa South", "Isuikwuato", "Mkad", "Nkporo", "Obi Ngwa", "Ohafia", "Osisioma Ngwa", "Ugwunagbo", "Ukwa East", "Ukwa West", "Umuahia North", "Umuahia South", "Umunneochi"],
  "Adamawa": ["Demsa", "Fufore", "Ganye", "Gireri", "Gombi", "Guyuk", "Hong", "Jada", "Madla", "Maiha", "Mayo Belwa", "Michika", "Mubi North", "Mubi South", "Numan", "Shelleng", "Siboru", "Song", "Toungo", "Yola North", "Yola South"],
  "Akwa Ibom": ["Abak", "Essien Udim", "Etim Ekpo", "Etinan", "Ibeno", "Ibesikpo Asutan", "Ibiaou", "Ibibio", "Ikot Abasi", "Ikot Ekpene", "Ini", "Itu", "Mkpaenyong", "Nsit Atai", "Nsit Ibom", "Nsit Ubium", "Obot Akara", "Okobo", "Onna", "Oron", "Oruk Anam", "Udung Uko", "Ukanafun", "Uyo", "Uruan"],
  "Anambra": ["Aguata", "Anambra East", "Anambra West", "Anaocha", "Awka North", "Awka South", "Ayamelum", "Dunukofia", "Ekwusigo", "Idemili North", "Idemili South", "Ihiala", "Njikoka", "Nnewi North", "Nnewi South", "Ogbaru", "Onitsha North", "Onitsha South", "Orumba North", "Orumba South", "Oyi"],
  "Bauchi": ["Alkaleri", "Bauchi", "Bogoro", "Damban", "Darazo", "Dass", "Ganjuwa", "Giade", "Itas/Gadau", "Jama'are", "Katagum", "Kirfi", "Lere", "Misau", "Ningi", "Shira", "Tafawa Balewa", "Toro", "Warji", "Zaki"],
  "Bayelsa": ["Brass", "Ekeremor", "Sagbama", "Ughelli North", "Ughelli South", "Warri North", "Warri South", "Warri South West", "Yenagoa"],
  "Benue": ["Ado", "Agatu", "Apa", "Buruku", "Gboko", "Guma", "Gwer East", "Gwer West", "Katsina Ala", "Konshisha", "Koton Karfe", "Logo", "Makurdi", "Obi", "Ogbadibo", "Ohimini", "Ojo", "Okpokwu", "Otukpo", "Tarka", "Ukum", "Ushongo", "Vandeikya"],
  "Borno": ["Abadam", "Askira/Uba", "Bama", "Bayo", "Biu", "Chibok", "Damboa", "Dikwa", "Gujba", "Guzamala", "Gwoza", "Jere", "Kaga", "Kala/Balge", "Konduga", "Kosubosu", "Kumshe", "Kwaya Kusar", "Mafa", "Magumeri", "Maiduguri", "Marte", "Mobbar", "Monguno", "Nganzai", "Nguru", "Shani", "Ubandawaki"],
  "Cross River": ["Abi", "Akamkpa", "Akpabuyo", "Bakassi", "Bekwarra", "Biase", "Boki", "Calabar Municipal", "Calabar South", "Cameroon", "Etung", "Ikom", "Obanliku", "Oban", "Odukpani", "Ogoja", "Oron", "Yala"],
  "Delta": ["Aniocha North", "Aniocha South", "Bomadi", "Burutu", "Delta Central", "Ethymakia", "Ika North East", "Ika South", "Isoko North", "Isoko South", "Ndokwa East", "Ndokwa West", "Nsuka", "Okpe", "Oleh", "Oredo", "Oshimili South", "Otor", "Oyigbo", "Patani", "Uvwie", "Warri North", "Warri South", "Warri South West"],
  "Ebonyi": ["Abakaliki", "Afikpo North", "Afikpo South", "Ebonyi", "Egbelu", "Enugu East", "Enugu North", "Enugu South", "Ezza North", "Ezza South", "Ezi-Ibam", "Ishielu", "Isuikwuato", "Izzi", "Nsukka", "Nkanu East", "Nkanu West", "Ohaozara", "Okposi", "Onicha", "Owobo", "Udenu", "Umunneke", "Uzo Uwani"],
  "Edo": ["Akoko Edo", "Egor", "Esan Central", "Esan North East", "Esan South East", "Esan West", "Etsako Central", "Etsako East", "Etsako West", "Igueben", "Ikpoba Okha", "Iyamho", "Oredo", "Orhionmwon", "Osa", "Owan East", "Owan West", "Uhunmwonde"],
  "Ekiti": ["Ado Ekiti", "Aiyekire", "Akoko", "Akokoland", "Ekiti East", "Ekiti South West", "Ekiti West", "Emure", "Enure", "Ese", "Gbonyin", "Geri", "Ijero", "Ijesa South", "Ijesha East", "Ikare", "Ikeleland", "Ikere", "Ila", "Ilaje", "Ilejemeje", "Ilesa West", "Iloro", "Imeko Afijio", "Ipoti", "Irele", "Irepodun", "Ise", "Ishara", "Isin", "Isokan", "Itori", "Iwoland", "Iwo", "Iwopin", "Iworo"],
  "Enugu": ["Aninri", "Awgu", "Enugu", "Enugu East", "Enugu North", "Enugu South", "Ezeagu", "Igbo Etiti", "Igbo Eze North", "Igbo Eze South", "Isuochi", "Ituku Ozalla", "Iva Valley", "Nkanu", "Nkanu East", "Nkanu West", "Nsayisi", "Nsi", "Nsukka", "Ogene", "Okigwe", "Orji", "Orsumaga", "Otuocha", "Oturkpo", "Owerre", "Owinigbo", "Ozuo", "Udenu", "Uduh", "Udi", "Uduma", "Umuahia", "Umunneke", "Umuofia", "Umupuogwu", "Umusu", "Umu-Awa", "Unegbo", "Ununu"],
  "Federal Capital Territory": ["Abuja Municipal Area Council", "Abaji", "Bwari", "Gwagwalada", "Kuje", "Kwali"],
  "Gombe": ["Akko", "Balanga", "Billiri", "Dukku", "Funakaye", "Gombe", "Gujba", "Gulani", "Gumau", "Guyuk", "Hong", "Jebia", "Kaltungo", "Kasuwan Magani", "Katsina", "Katagum", "Keffi", "Konkol", "Kumo", "Kwami", "Lafia", "Langtang", "Lalupon", "Liapim", "Liji", "Lokoja", "Longuda", "Lowere", "Maakin", "Madumba", "Magamagu", "Majigatari", "Makurdi", "Maltagani", "Mangu", "Manso", "Maraba", "Maragi", "Marhasum", "Marke", "Markudi", "Marong", "Maruba", "Marve", "Masaba", "Masagari", "Masangu", "Masari", "Masassa", "Masashe", "Masau", "Masenge", "Maseyari", "Mashai", "Mashalela", "Mashawari", "Mashaye", "Masiaka", "Masianzu", "Masida", "Masidu", "Masigiri", "Masikiri"],
  "Imo": ["Aboh Mbaise", "Ahiazu Mbaise", "Ehime Mbano", "Ezinihitte Mbaise", "Ideato North", "Ideato South", "Ihitte/Uboma", "Ikeduru", "Isiala Mbano", "Isimangano", "Isu", "Mbaitoli", "Nkwerre", "Ngor Okpala", "Obowo", "Oguta", "Ohaji/Egbema", "Okigwe", "Okorocha", "Olu", "Onuimo", "Oreri", "Orlu", "Oru East", "Oru West", "Orumba", "Osisioma", "Owerri Municipal", "Owerri North", "Owerri West", "Owobo", "Oyigbo", "Ozuitem", "Ubakala", "Umuahia", "Umuaka", "Umuchukwu", "Umudike", "Umuguma", "Umuihi", "Umukwa", "Umundi", "Umungwali", "Umunneke", "Umunogu", "Umunze", "Umunya"],
  "Jigawa": ["Auyo", "Babbar", "Biriniwa", "Buji", "Dutse", "Gagarawa", "Garki", "Gavako", "Giade", "Gumel", "Guri", "Gwiwa", "Hadejia", "Jahun", "Jigawa", "Kadada", "Kafin Hausa", "Kake", "Karaye", "Karofi", "Kosubosu", "Kukar Gida", "Kura", "Kurfi", "Kurshai", "Kusada", "Kuyello", "Kwankwaso", "Kware", "Kwiambana", "Maigatari", "Magama", "Magari", "Maigatari", "Maille", "Mainok", "Maiwada", "Majiya", "Makali", "Maradi", "Marke", "Maroto", "Marshi", "Maruba", "Marve", "Masada", "Masangu", "Masari", "Masassa", "Masashe"],
  "Kaduna": ["Agara", "Agwai", "Akala", "Akauk", "Akiba", "Akila", "Akuro", "Andamberi", "Andu", "Anfani", "Angwan Aji", "Ankwanshi", "Ankwei", "Ansuanko", "Apiko", "Apkorogene", "Apo", "Aremu", "Ari", "Arifa", "Arinyo", "Arishi", "Ariya", "Aroke", "Aroki", "Aronda", "Aropaja", "Arotema", "Arowa", "Arshi", "Arun", "Aruolo", "Aruo", "Aruwali", "Aruwan", "Asa", "Asaba", "Asah", "Asalu", "Asamu", "Asana", "Asanatare", "Asandun", "Asangi", "Asanigwu", "Asaniko"],
  "Kano": ["Ajinkyira", "Ajiya", "Akib", "Akika", "Akinyele", "Akiru", "Akoko", "Akonda", "Akora", "Akot", "Akotie", "Akoto", "Akowai", "Akoza", "Akpakot", "Akpakpan", "Akpan", "Akpandem", "Akpanfon", "Akpaning", "Akpansere", "Akpanso", "Akpantan", "Akpantee", "Akpaondu", "Akpara", "Akparku", "Akpata", "Akpatem", "Akpatete", "Akpati", "Akpatim", "Akpatsim"],
  "Katsina": ["Achaleke", "Achafra", "Achalawa", "Achalonu", "Achambara", "Achamkpi", "Achancham", "Achandigwu", "Achandu", "Achanelu", "Achania", "Achankori", "Achanko", "Achannim", "Achanogbaja", "Achanugwu", "Achanya", "Achanya", "Achanyagbu", "Achanyamba", "Achanyangwa", "Achanyelu", "Achanyefu", "Achanyekwu", "Achanyi", "Achanyichikwu", "Achanyide", "Achanyidim"],
  "Kebbi": ["Aleiro", "Arewa", "Argungu", "Augie", "Bagudo", "Birnin Kebbi", "Bunza", "Dandi", "Fakai", "Gwandu", "Jega", "Kalgo", "Kamba", "Kaoje", "Katsina", "Kaura", "Kola", "Koza", "Maiyama", "Makera", "Malumfashi", "Manifestin", "Mann", "Maradi", "Marijuana", "Maska", "Matanshi", "Matarun", "Matasa", "Matata"],
  "Kogi": ["Adavi", "Ajaokuta", "Akoko", "Akuna", "Akurba", "Akuzu", "Alanga", "Alangi", "Alanyo", "Alapata", "Alaro", "Alaruko", "Alarun", "Alata", "Alaye", "Alebo", "Alebu", "Alegbe", "Alegebeleye", "Alegedu", "Alegede", "Alegede", "Alegegbe", "Alegen", "Aleboje", "Alebu", "Alebushe", "Alebushe", "Alebuche", "Alebuje", "Alebuke"],
  "Kwara": ["Asa", "Asawo", "Asaye", "Aselu", "Aselu", "Aselu", "Aselu", "Aselu", "Aselu", "Aselu", "Aselu", "Aselu", "Aselu", "Aselu", "Aselu", "Aselu", "Aselu", "Aselu", "Aselu", "Aselu"],
  "Lagos": ["Agege", "Ajeromi Ifelodun", "Alimosho", "Amuwo Odofin", "Apapa", "Badagry", "Epe", "Eti Osa", "Ibeju Lekki", "Ifako Ijaiye", "Ikorodu", "Ikeja", "Ikoyi", "Isolo", "Kosofe", "Lagos Island", "Lagos Mainland", "Lekki", "Mushin", "Ojodu", "Ojo", "Okeleko", "Olusosun", "Oluwole", "Omorege", "Onigbongbo", "Onitsha", "Onubayi", "Onunawo", "Onuora", "Opebi", "Oremeji", "Oregun", "Oremeji", "Orile Agege", "Orile Iwopin", "Orilingbi", "Orin", "Orinlere", "Oriolowo", "Oriola", "Orisun", "Oritse", "Oritse", "Oriyo", "Oriye", "Oriyo", "Oriyomi"],
  "Nasarawa": ["Akwanga", "Awe", "Doma", "Garoua", "Garua North", "Garua South", "Gaura", "Gawu", "Gaza", "Gedem", "Gei", "Gema", "Gembu", "Gendarbo", "Gendoga", "Gendugba", "Genduma", "Genduma", "Gendumba", "Gendung", "Genduro", "Genduwu", "Gendwala", "Gendwala", "Genegaliu", "Genegali", "Genegwa", "Genegwi", "Genegwu", "Genegwu", "Genekpo"],
  "Niger": ["Abuja", "Abugo", "Agaie", "Agara", "Agara", "Agramma", "Agudu", "Agwanim", "Agwaranci", "Agwara", "Agwaranze", "Agwarem", "Agwariche", "Agwarika", "Agwarini", "Agwaro", "Agwarope", "Agwaroti", "Agwaruci", "Agwaru", "Agwaruko", "Agwarume", "Agwaruni", "Agwarunyi", "Agwarup", "Agwaruse", "Agwaruva", "Agwatashi"],
  "Ogun": ["Abeokuta North", "Abeokuta South", "Ado Odo Ota", "Ifo", "Ijebu East", "Ijebu North", "Ijebu North East", "Ijebu Ode", "Ikenne", "Imeko Afijio", "Ipokia", "Irewole", "Irepodun", "Iseyin", "Iwajowa", "Kabi", "Kodierno", "Latiku", "Letaita", "Lewu", "Lipe", "Loda", "Logo", "Logomo", "Lokoja", "Lombolo", "Londoke"],
  "Ondo": ["Akaka", "Akamkpa", "Akinyele", "Akoko", "Akoka", "Akore", "Akoro", "Akotaobu", "Akotaoye", "Akotapo", "Akotason", "Akotasuun", "Akotawo", "Akotawoye", "Akote", "Akoteo", "Akotere", "Akoterika", "Akotero", "Akoteron", "Akoteru", "Akoteru", "Akote", "Akotete"],
  "Osun": ["Abeokuta", "Abiodun", "Abiye", "Abo Odo", "Aboki", "Abokinan", "Abokuta", "Abokunrin", "Abokuta", "Abokunro", "Abokuso", "Abokunrin", "Abokuntan", "Abokundun", "Abokunkun", "Abokunru", "Abokunsu", "Abokuntan", "Abokunti", "Abokuntin"],
  "Oyo": ["Afijio", "Ahinan", "Akinmuyan", "Akinsinde", "Akinsoye", "Akintan", "Akinwale", "Akinyele", "Akinyemi", "Akinyemi", "Akinyode", "Akinyo", "Akinyole", "Akinyomi", "Akinyor", "Akinyose", "Akinyosoye", "Akinyu", "Akinyude", "Akinyun", "Akinzade", "Akira", "Akiri", "Akiribo", "Akiringbo", "Akiriti", "Akiritun"],
  "Plateau": ["Bokkos", "Busa", "Daret", "Demsa", "Dengi", "Diffo", "Dihim", "Dik", "Dillim", "Dilli", "Dimbam", "Dimbir", "Dimdi", "Dimdim", "Dimdimu", "Dindin", "Dindim", "Dinemin", "Dinfim", "Dingdu", "Dinha", "Dinhim", "Dinin", "Dinki", "Dinkin", "Dinkon", "Dinkunja"],
  "Rivers": ["Abua", "Abua Odual", "Abuan", "Abuanya", "Abuanne", "Abuanoh", "Abuasah", "Abuaya", "Abudu", "Abue", "Abuegbe", "Abuegh", "Abuei", "Abuej", "Abueka", "Abuele", "Abuem", "Abuen", "Abueni", "Abueno", "Abuep", "Abuer", "Abues", "Abuesa", "Abueso", "Abuet", "Abuetta", "Abuetuo"],
  "Sokoto": ["Binji", "Bodinga", "Dange Shuni", "Gada", "Goronyo", "Gumbo", "Gudu", "Gwadabawa", "Illela", "Isa", "Kamba", "Kasarau", "Kaura", "Kaura Namoda", "Kaurannamoda", "Kebbe", "Kogo", "Kolgi", "Korau", "Koulma", "Kowa", "Kowaje", "Koya", "Koyara", "Kubau", "Kube", "Kubi", "Kubu", "Kuce"],
  "Taraba": ["Ardo Kola", "Ardokola", "Ardoni", "Arkukun", "Artimbako", "Ashaka", "Ashaki", "Aswara", "Atakpa", "Atakunun", "Atakunwa", "Atara", "Ataru", "Ataruk", "Atarwain", "Atasa", "Ataso", "Atasuwan", "Atata", "Atatau", "Atate", "Atatoa", "Atauan"],
  "Yobe": ["Bade", "Badzere", "Bailang", "Baimsama", "Bainwala", "Baka", "Bakare", "Bakari", "Bakarun", "Bakaun", "Bakawa", "Bakaye", "Bakde", "Bakden", "Bakdera", "Bakdere", "Bakderi", "Bakdo", "Bakendra", "Bakderi", "Bakdi"],
  "Zamfara": ["Aba", "Abadan", "Abamba", "Abambu", "Abang", "Abanya", "Abanye", "Abare", "Abarika", "Abarki", "Abarko", "Abraka", "Abarli", "Abarlili", "Abarni", "Abarni", "Abarodo", "Abarok", "Abaroko", "Abaru", "Abaruko", "Abasa", "Abasakuma", "Abasaki", "Abasakin", "Abasalu", "Abasami", "Abasamu", "Abasani", "Abasau"]
};

export const registrationCategories = [
  "Painting",
  "French Spelling Bee",
  "Essay Writing",
  "Music and Dance",
  "All"
];

export const studentLevels = [
  "Individual (Artist, Music, French and Writing)",
  "University Student",
  "Senior Secondary",
  "Junior Secondary",
  "Primary",
  "Nursery"
];

export const classOptions: { [key: string]: string[] } = {
  "Individual (Artist, Music, French and Writing)": ["Your Location Address"],
  "University Student": ["Level 100", "Level 200", "Level 300", "Level 400"],
  "Senior Secondary": ["SS1", "SS2", "SS3"],
  "Junior Secondary": ["JSS1", "JSS2", "JSS3"],
  "Primary": ["Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6"],
  "Nursery": ["Nursery 1", "Nursery 2", "Nursery 3"]
};
